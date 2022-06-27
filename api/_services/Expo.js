const { Expo } = require('expo-server-sdk');

// let expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });
let expo = new Expo();


//   messages.push({
//     to: pushToken,
//     sound: 'default',
//     body: 'This is a test notification',
//     data: { withSome: 'data' },
//   })
// }

module.exports =  {
    async sendNotification(pushTokens, title, message, data = {}) {
        messages = [];
        for (let token of pushTokens) {
            if (Expo.isExpoPushToken(token)) {
                messages.push({
                    to: token,
                    sound: 'default',
                    title: title,
                    body: message,
                    data: data,    
                })
            }
        }
        let chunks = expo.chunkPushNotifications(messages);
         for (let chunk of chunks) {
              await expo.sendPushNotificationsAsync(chunk);
          }
    },
}
