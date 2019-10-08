var groupKey = Gun.text.random(24);
var user = gun.user();

var setTrust = async function (pubKey, groupName, groupKey, user) {
  var epub = await gun.user(pubKey).promOnce();
  console.log('epub,',epub);
  epub = epub.data.epub;
  var padLock = await SEA.secret(epub, {epub:user._.sea.epub, epriv:user._.sea.epriv});
  var enc = await SEA.encrypt(groupKey, padLock);
  user.get('trust').get(groupName).get(pubKey).put(enc);
}

var createTrustedArea = async function (groupName,groupKey, user) {
  var padLock = await SEA.secret(user._.sea.epub, {epub:user._.sea.epub,epriv:user._.sea.epriv});
  var enc = await SEA.encrypt(groupKey, padLock);
  await user.get('trust').get(groupName).get(user._.sea.pub).promPut(enc);
  user.leave();
  return await new Promise((res,rej)=>{
    user.create(groupName, groupKey, res);
  });
}


var authToSharedArea = async function (groupName, pubKey, alias) {
  var useral = await gun.get('~@'+alias).promOnce();
  useral = useral.data;
  var pubKeyal = Object.keys(useral);
  pubKeyal = pubKeyal[1];
  console.log(pubKeyal);
  var enc = await gun.get(pubKeyal).get('trust').get(groupName).get(pubKey).promOnce();
  enc = enc.data;
  console.log(enc);
  var secret = await SEA.secret(user._.sea.epub, /*other user*/);
  var groupKey = await SEA.decrypt(enc, secret);
  user.leave();
  return await new Promise((res,rej)=>{
    user.auth(groupName, groupKey, res);
  });
}
