module.exports = (services) => {
     return {
          create: () => (services.crypter.token.randomChar(128)),
          system: true,
          header: 'x-session',
          options:{
               type: 'JWT',
               key: 'thisisthefutursecretkey5',
               expireIn: '60d',
          }
     }
}