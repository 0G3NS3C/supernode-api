module.exports = (services) => {
     return {
          create: () => (services.crypter.token.randomChar(64)),
          system: true,
          options:{
               type: 'AES-256-GCM',
               key: 'thisisthefutursecretkey65',
               salt:'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', //<-- 64 length
               iteration: 1000, //<-- not big needed
               iv: "aaaaaaaaaaaaaaaa",//<-- 16 length
          }
     }
}