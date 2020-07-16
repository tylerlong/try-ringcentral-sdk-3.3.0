const SDK = require('ringcentral')
const delay = require('timeout-as-promise')

var rc = new SDK({
  server: process.env.RINGCENTRAL_SERVER_URL,
  appKey: process.env.RINGCENTRAL_CLIENT_ID,
  appSecret: process.env.RINGCENTRAL_CLIENT_SECRET
})

;(async () => {
  await rc.platform().login({
    username: process.env.RINGCENTRAL_USERNAME,
    extension: process.env.RINGCENTRAL_EXTENSION,
    password: process.env.RINGCENTRAL_PASSWORD
  })

  const oldToken = await rc.platform().auth().data();
  console.log('old token: ', oldToken);

  await delay(3000);

  // first API call
  let r = await rc.platform().get('/restapi/v1.0/account/~/extension/~')
  console.log('first api call', r.json().id)

  await delay(3000);

  // refresh it
  await rc.platform().refresh();
  const newToken = await rc.platform().auth().data();
  console.log('new token: ',  newToken);

  await delay(3000);

  // restore the old token
  rc.platform().auth().setData(oldToken);

  await delay(3000);

  // refresh it again
  await rc.platform().refresh();
  const newToken2 = await rc.platform().auth().data();
  console.log('new token 2: ',  newToken2);

  await delay(3000);

  // second API call
  r = await rc.platform().get('/restapi/v1.0/account/~/extension/~')
  console.log('second api call', r.json().id)

  await rc.platform().logout();
})()
