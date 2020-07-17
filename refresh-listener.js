const SDK = require('ringcentral')
const delay = require('timeout-as-promise')
const fs = require('fs')

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

  const platform = rc.platform();
  platform.on(platform.events.refreshSuccess, () => {
    console.log('refresh success, I need to save new token to database');
  });

  await rc.platform().refresh();
  await delay(1000);
  await rc.platform().refresh();
  await delay(1000);
  await rc.platform().refresh();
  await delay(1000);
})()
