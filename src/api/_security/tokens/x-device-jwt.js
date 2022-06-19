module.exports = (services) => {
     return {
          create: () => (services.crypter.token.randomChar(128)),
          system: true,
          header: 'x-device',
          options:{
               type: 'JWT',
               key: 'thisisthefutursecretkey3',
               expireIn: '365d',
          }
     }
}