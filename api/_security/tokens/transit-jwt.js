module.exports = (services) => {
     return {
          create: () => (services.crypter.token.randomChar(128)),
          system: true,
          header: 'transit',
          options:{
               type: 'JWT',
               key: 'thisisthefutursecretkey2',
               expireIn: '1d',
          }
     }
}