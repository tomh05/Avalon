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
}

class State extends Schema {
    @type("string") gamePhase: string;
    @type("string") currentKing: string;
    @type({ map: Player }) players = new MapSchema();
    @type(["string"]) playerOrder: string[] = new ArraySchema<string>();
    @type(["number"]) quests: number[] = new ArraySchema<number>(0, 0, 0, 0, 0);
    @type({ map: Player }) playersOnQuest = new MapSchema();
}

export class TicTacToe extends Room<State> {
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
                }
                else if (this.state.gamePhase == "EXPLAINING_ROLES") {
                    {
                        this.assignFirstKing()
                    }
                }
            }
        }

        if ( "name" in data && this.state.gamePhase == "LOBBY") {
            this.state.players[client.sessionId].name = data.name; 
        }
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

    clearReadyStatus() {
        console.log("clearing ready status")
        for (let id in this.state.players) {
            this.state.players[id].ready = false
            console.log(`Player ${id} is ${this.state.players[id].ready}`);
        }
    }

    startGame() {
        this.setGamePhase("ASSIGNING_ROLES");
        this.checkEveryoneReady()
        this.lock();
        this.setupPlayOrder();
        this.setupRoles();
        this.checkEveryoneReady()
        this.setGamePhase("EXPLAINING_ROLES");
        this.checkEveryoneReady()
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


    checkWin (x, y, move) {
        let won = false;
        let quests = this.state.quests;

        return won;
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

