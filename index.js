const SDK = require('ringcentral')
const delay = require('timeout-as-promise')

var rcsdk = new SDK({
  server: process.env.RINGCENTRAL_SERVER_URL,
  appKey: process.env.RINGCENTRAL_CLIENT_ID,
  appSecret: process.env.RINGCENTRAL_CLIENT_SECRET
})

;(async () => {
  await rcsdk.platform().login({
    username: process.env.RINGCENTRAL_USERNAME,
    extension: process.env.RINGCENTRAL_EXTENSION,
    password: process.env.RINGCENTRAL_PASSWORD
  })

  var subscription = rcsdk.createSubscription()

  subscription.on(subscription.events.notification, function (msg) {
    console.log(msg, msg.body)
  })

  await subscription.setEventFilters(['/restapi/v1.0/account/~/extension/~/message-store']).register()

  while (true) {
    await rcsdk.platform().post('/restapi/v1.0/account/~/extension/~/sms', {
      from: { phoneNumber: process.env.RINGCENTRAL_USERNAME },
      to: [{ phoneNumber: process.env.RINGCENTRAL_RECEIVER }],
      text: 'hello world'
    })
    await delay(10000)
  }
})()
