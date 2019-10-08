const path = require('path');
const express = require('express');
const Gun = require('gun');
const SEA = require('gun/sea');


const port = (process.env.PORT || 8080);
const host = '0.0.0.0';

let userN = process.argv[2]; // user name from cli
let passphrase = process.argv[3]; // passphrase from cli

try {
  var publicKey = process.argv[4]; // Pass a plubic key to trust
} catch (e) {
  console.log(e);
}

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


var gun = Gun({
  web: server,
  axe: false
});

gun._.on('in', logIn);
gun._.on('out', logOut);


function logPeers() {
  console.log(`Peers: ${Object.keys(gun._.opt.peers).join(', ')}`);
}

setInterval(logPeers, 5000); //Log peer list every 5 secs


const view = path.join(__dirname, 'view/main.html');

app.use(express.static('view'));
app.get('*', function(_, res) {
  res.sendFile(view);
});
