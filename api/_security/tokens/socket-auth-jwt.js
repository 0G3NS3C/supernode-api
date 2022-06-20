module.exports = (services) => {
     return {
          create: () => (services.crypter.token.randomChar(128)),
          system: true,
          header: 'socket-auth',
          options:{
               type: 'JWT',
               key: 'thisisthefutursererereetkey5',
               expireIn: '60d',
          }
     }
}