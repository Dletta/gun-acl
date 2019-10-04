const path = require('path');
const express = require('express');
const Gun = require('gun');
const SEA = require("gun/sea");

const port = (process.env.PORT || 8080);
const host = '0.0.0.0';

let userN = process.argv[2];
let passphrase = process.argv[3];

const app = express();
app.use(Gun.serve);

const server = app.listen(port, host);

console.log(`server listening on http://${host}:${port}`);

function logIn(msg){
  console.log(`in msg:${JSON.stringify(msg)}.........`);
}

function logOut(msg){
  console.log(`out msg:${JSON.stringify(msg)}.........`);
}

function logAuth() {
  gun.user().auth(userN, passphrase, function(ack) {
    console.log('auth callback');
    if(ack.err){
      console.log(ack.err);
      console.log('reattempting in 1 second');
      setTimeout(logAuth.bind(this), 1000)
    } else {
      console.log('User logged in');
    }
  });
}

var gun = Gun({
  web: server
});

gun._.on('in', logIn);
gun._.on('out', logOut);

logAuth()

function logPeers() {
  console.log(`Peers: ${Object.keys(gun._.opt.peers).join(', ')}`);
}

setInterval(logPeers, 5000); //Log peer list every 5 secs


const view = path.join(__dirname, 'view/main.html');

app.use(express.static('view'));
app.get('*', function(_, res) {
  res.sendFile(view);
});