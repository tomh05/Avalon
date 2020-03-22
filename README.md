# Avalon Multiplayer

Using Colyseus Game Server (v0.12.x)

# Running locally as a developer

You'll need two terminal windows open to be able to run this. One for the
client, and one for the server:

**Running the server**

```
cd server
npm install
npm run dev
```

**Running the client**

```
cd client
npm install
npm start
```

# Deployment
A Git hook causes changes to the app to be built using AWS Codebuild and deployed to the Elastic Beanstalk instance.
To build and run in deployment mode:
```
cd client
npm install
npm run build
cd ../server
npm install
npm run build
npm start
```

## License

MIT
