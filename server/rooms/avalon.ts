import { Room, Delayed, Client } from 'colyseus';
import { type, Schema, MapSchema, ArraySchema } from '@colyseus/schema';

const TURN_TIMEOUT = 10
const BOARD_WIDTH = 3;

const MIN_PLAYERS = 1;
const MAX_PLAYERS = 10;

enum Allegiances { GOOD, EVIL, UNDEFINED };
//enum Roles { GENERIC_GOOD, GENERIC_EVIL, MERLIN, ASSASSIN };
//enum STATES {LOBBY, ASSIGNING_ROLES, EXPLAINING_ROLES, CHOOSING_KNIGHTS, VOTING, REVEALING_VOTE, QUESTING, REVEALING_RESULT}

class Player extends Schema {
    @type("string") id: string;
    @type("string") name: string;
    @type("boolean") ready: boolean;
    @type("boolean") isParticipant: boolean;

    /*
  @filter(function(
    this: Player,
    client: Client,
    value?: Player['allegiance'], // the value of the field to be filtered. (value of `number` field)
    root?: Schema // the root state Schema instance
  ) {
    return  this.id === client.sessionId;
  });


  @filter(function(
    this: Player,
    client: Client,
    value?: Player['role'], // the value of the field to be filtered. (value of `number` field)
    root?: Schema // the root state Schema instance
  ) {
    return  this.id === client.sessionId;
  });
     */
    @type("string") allegiance: string;
    @type("string") role: string;
    @type("string") vote: string;
    @type("string") questContribution: string;
}

class Quest extends Schema {
    @type("number") requiredParticipants: number;
    @type("number") requiredFails: number;
    @type("string") outcome: string;
}

class State extends Schema {
    @type("string") gamePhase: string;
    @type("boolean") votePassed: boolean;
    @type("number") currentQuest: number;
    @type("string") currentKing: string;
    @type({ map: Player }) players = new MapSchema();
    @type(["string"]) playerOrder: string[] = new ArraySchema<string>();
    @type([Quest]) quests: Quest[] = new ArraySchema<Quest>();
    @type({ map: Player }) questParticipants = new MapSchema();
}

export class Avalon extends Room<State> {
    maxClients = 10;
    timeout: Delayed;

    onCreate () {
        this.setState(new State())
        this.setGamePhase("LOBBY")
    }

    onJoin (client: Client) {
        const newPlayer = new Player();
        newPlayer.id = client.sessionId;
        //newPlayer.name = `Player ${Object.keys(this.state.players).length + 1}`
        this.state.players[client.sessionId] = newPlayer;

        if (Object.keys(this.state.players).length === this.maxClients) {
            // lock this room for new users
            this.lock();
        }
    }

    onMessage (client: Client, data: any) {
        console.log("got message!", data);

        if ( "ready" in data) {
            this.state.players[client.sessionId].ready = data.ready; 

            if (this.checkEveryoneReady()) {
                this.clearReadyStatus() 
                if ( this.state.gamePhase == "LOBBY") {
                    this.startGame()
                } else if (this.state.gamePhase == "EXPLAINING_ROLES") {
                    this.assignFirstKing()
                } else if ( this.state.gamePhase == "REVEALING_VOTE") {
                    if (this.state.votePassed) {
                        this.setGamePhase("QUESTING");
                    } else {
                        this.assignNextKing();
                        this.setGamePhase("CHOOSING_KNIGHTS");
                    }
                } else if ( this.state.gamePhase == "REVEALING_QUEST") {
                    this.endTurn();
                }
            }
        } else if ( "name" in data && this.state.gamePhase == "LOBBY") {
            this.state.players[client.sessionId].name = data.name; 
        } else if ( "participant" in data ) {
            if ( this.state.gamePhase == "CHOOSING_KNIGHTS" && client.sessionId == this.state.currentKing) {
                this.toggleParticipant(data.participant);
            }
        } else if ( "callVote" in data && this.state.gamePhase == "CHOOSING_KNIGHTS") {
            if (this.countParticipants() ==  this.state.quests[this.state.currentQuest].requiredParticipants) {
                this.setGamePhase("VOTING");
            } else {
                console.warn('wrong number of participants:', this.countParticipants());
            }

        } else if ( "vote" in data ) {
            this.state.players[client.sessionId].vote = data.vote
            this.assessVote();

        } else if ( "questContribution" in data && this.state.gamePhase == "QUESTING") {
            this.state.players[client.sessionId].questContribution = data.questContribution 
            this.assessQuest();
        } else {
            console.warn('unhandled message:', data);
        }
    }

    toggleParticipant(playerId) {
        const player = this.state.players[playerId]

        if (!player) return;

        if (player.isParticipant) {
            player.isParticipant = false
        } else {
            console.log('num participants:',this.countParticipants())
            console.log('cur quest:',this.state.currentQuest);
            console.log('max participants:',this.state.quests[this.state.currentQuest].requiredParticipants);
            if (this.countParticipants() < this.state.quests[this.state.currentQuest].requiredParticipants) {
                player.isParticipant = true
            } else {
                console.log('max participants for this quest reached');
            }
        }
    }

    countParticipants() {
        var numParticipants = 0;

        for (let id in this.state.players) {
            if (this.state.players[id].isParticipant) {
                numParticipants +=1;
            }
        }
        return numParticipants;
    }

    checkEveryoneReady() {
        let numberOfPlayers = Object.keys(this.state.players).length;
        let result = true;

        if (numberOfPlayers < MIN_PLAYERS || numberOfPlayers > MAX_PLAYERS) result = false;

        for (let id in this.state.players) {
            if (!this.state.players[id].ready) result = false;
        }
        console.log('checkEveryoneReady result is', result);
        return result;
    }

    assessVote() {
        let numberOfPlayers = Object.keys(this.state.players).length;
        let ayes = 0;

        // abort if someone hasn't voted yet
        for (let id in this.state.players) {
            switch (this.state.players[id].vote) {
                case "APPROVE":
                    ayes +=1;
                    break;
                case "REJECT":
                    break;
                default: 
                    // somebody hasn't voted yet. Abort.
                    return;
            }
        }

        console.log("percentage in favour: ", 100 *  ayes/numberOfPlayers)
        const votePassed = ((ayes / numberOfPlayers) >= 0.5)

        this.state.votePassed = votePassed;
        this.setGamePhase("REVEALING_VOTE");

    }

    assessQuest() {

        console.log('assessing quest')
        let fails = 0;

        // abort if someone hasn't contributed yet
        for (let id in this.state.players) {
            const player = this.state.players[id];
            if (player.isParticipant) {
                console.log("evaluating contribution",player.questContribution)
                switch (player.questContribution) {
                    case "SUCCESS":
                        break;
                    case "FAIL":
                        fails +=1;
                        break;
                    default: 
                        // somebody hasn't voted yet. Abort.
                        return;
                }
            }
        }

        console.log('fails', fails)
        console.log("fails", this.state.quests[this.state.currentQuest].requiredFails) 

        if (fails < this.state.quests[this.state.currentQuest].requiredFails) {
            this.state.quests[this.state.currentQuest].outcome = "SUCCESS"
        } else {
            this.state.quests[this.state.currentQuest].outcome = "FAIL"
        }

        this.setGamePhase("REVEALING_QUEST");
    }

    clearReadyStatus() {
        for (let id in this.state.players) {
            this.state.players[id].ready = false
        }
    }

    clearVotes() {
        for (let id in this.state.players) {
            this.state.players[id].vote = ""
        }
    }

    clearQuestContributions() {
        for (let id in this.state.players) {
            this.state.players[id].questContribution = ""
        }
    }

    endTurn() {
        this.clearQuestContributions();
        switch (this.checkVictory()) {
            case "GOOD":
                this.setGamePhase("ASSASSINATION_ATTEMPT");
                break;
            case "EVIL":
                this.setGamePhase("EVIL_VICTORY");
                break;
            default:
                this.state.currentQuest += 1;
                this.assignNextKing();
                this.setGamePhase("CHOOSING_KNIGHTS");
        }
    }

    checkVictory() {
        // if 3 quests fail, EVIL wins
        // if 3 quests succeed, Good wins unless the assassin chooses merlin

        let numFails = this.state.quests.filter(q=> q.outcome == "FAIL").length;
        let numSuccesses = this.state.quests.filter(q=> q.outcome == "SUCCESS").length;

        if (numFails >= 3) {
            return "EVIL"
        }

        if (numSuccesses >= 3) {
            return "GOOD"
        }

        return "GAME_CONTINUES";
    }

    startGame() {
        this.setGamePhase("ASSIGNING_ROLES");
        this.lock();
        this.setupPlayOrder();
        this.setupRoles();
        this.setupQuests();
        this.setGamePhase("EXPLAINING_ROLES");
    }

    setGamePhase(newPhase) {
        console.log(`Changing phase from ${this.state.gamePhase} to ${newPhase}`)
        this.state.gamePhase = newPhase
    }

    setupPlayOrder() {
        let index=0;
        for (let id in this.state.players) {
            const player: Player = this.state.players[id];
            console.log(id, player);
            this.state.playerOrder[index] = id;
            index+=1;
        }
        console.log("player order is",this.state.playerOrder);

    }

    setupRoles() {

        let numberOfPlayers = Object.keys(this.state.players).length;
        let roles = ["MERLIN", "ASSASSIN", "GENERIC_EVIL"];
        if (numberOfPlayers > 6) {
            roles.push("GENERIC_EVIL");
        }
        if (numberOfPlayers == 10) {
            roles.push("GENERIC_EVIL");
        }
        while (roles.length < numberOfPlayers) {
            roles.push("GENERIC_GOOD");
        }

        // shuffle roles
        roles.sort(function() { return 0.5 - Math.random();})

        // assign a role to each player
        for (let id in this.state.players) {
            const newRole = roles.pop();
            this.state.players[id].role = newRole
            this.state.players[id].allegiance = this.getAllegiance(newRole);
        }

    }

    setupQuests() {
        this.state.currentQuest = 0;

        let numberOfPlayers = Object.keys(this.state.players).length;
        let questRequiredParticipants;
        let questRequiredFails;

        switch (numberOfPlayers) {
            case 5:
                questRequiredParticipants = [2,3,2,3,3];
                questRequiredFails = [1,1,1,1,1];
                break;
            case 6:
                questRequiredParticipants = [2,3,4,3,4];
                questRequiredFails = [1,1,1,1,1];
                break;
            case 7:
                questRequiredParticipants = [2,3,3,4,4];
                questRequiredFails = [1,1,1,2,1];
                break;
            case 8:
            case 9:
            case 10:
                questRequiredParticipants = [3,4,4,5,5];
                questRequiredFails = [1,1,1,2,1];
                break;
            default:
                questRequiredParticipants = [1,1,1,1,1];
                questRequiredFails = [1,1,1,2,1];
                break;


        }

        for (let i=0; i<5; i++) {
            const newQuest = new Quest();
            newQuest.requiredParticipants = questRequiredParticipants[i];
            newQuest.requiredFails = questRequiredFails[i];
            this.state.quests.push(newQuest);
        }
    }

    getAllegiance(role:string) {
        if (role == "GENERIC_GOOD" || role == "MERLIN") {
            return "GOOD";
        }
        return "EVIL";
    }


    /*
setTimeout(seconds:number) {
    if (this.timeout) this.timeout.clear()
    this.timeout = this.clock.setTimeout(() => this.onTimeoutExpired(), seconds * 1000);
}
     */

    assignFirstKing() {
        this.state.currentKing = this.state.playerOrder[Math.floor(Math.random() * this.state.playerOrder.length)];
        this.setGamePhase("CHOOSING_KNIGHTS");
    }

    assignNextKing() {
        const currentKingPosition = this.state.playerOrder.indexOf(this.state.currentKing)
        const nextKingPosition = (currentKingPosition + 1) % this.state.playerOrder.length;
        this.state.currentKing = this.state.playerOrder[nextKingPosition];
    }

    onLeave (client) {
        delete this.state.players[ client.sessionId ];

        // allow more users to join
        this.unlock();

        let remainingPlayerIds = Object.keys(this.state.players)
        if (remainingPlayerIds.length > 0) {
            //this.state.winner = remainingPlayerIds[0]
        }
    }
}

