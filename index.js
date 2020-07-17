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
  const r1 = await rc.platform().get('/restapi/v1.0/account/~/extension/~')
  console.log('first api call', r1.json().id)

  await delay(3000);

  // refresh it
  await rc.platform().refresh();
  const newToken = await rc.platform().auth().data();
  console.log('new token: ',  newToken);

  await delay(3000);

  // restore the old token
  rc.platform().auth().setData(oldToken);
  let tokenRestored = await rc.platform().auth().data();
  console.log('token restored: ',  tokenRestored);
  console.log('token restored is identical to old token: ', oldToken.access_token === tokenRestored.access_token)

  await delay(3000);

  // refresh it again
  await rc.platform().refresh();
  const newToken2 = await rc.platform().auth().data();
  console.log('new token 2: ',  newToken2);

  await delay(3000);

  // second API call
  const r2 = await rc.platform().get('/restapi/v1.0/account/~/extension/~')
  console.log('second api call', r2.json().id)


  // restore the old token
  rc.platform().auth().setData(oldToken);
  tokenRestored = await rc.platform().auth().data();
  console.log('token restored: ',  tokenRestored);
  console.log('token restored is identical to old token: ', oldToken.access_token === tokenRestored.access_token)


  // refresh it again
  await rc.platform().refresh();
  const newToken3 = await rc.platform().auth().data();
  console.log('new token 3: ',  newToken3);

  await delay(3000);

  // third API call
  const r3 = await rc.platform().get('/restapi/v1.0/account/~/extension/~')
  console.log('third api call', r3.json().id)

  console.log('newToken.accessToken === newToken2.accessToken', newToken.accessToken === newToken2.accessToken)
  console.log('newToken.accessToken2 === newToken3.accessToken', newToken2.accessToken === newToken3.accessToken)

  await rc.platform().logout();
})()
