module.exports = (services) => {
     return {
          create: () => (services.crypter.token.randomChar(128)),
          system: true,
          options:{
               type: 'AES-256-GCM',
               key: 'thisisthefutuerereretkey65',
               salt:'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabaaaaaaaaaadaahaaaaaaaaaaaaaaaaa', //<-- 64 length
               iteration: 1000, //<-- not big needed
               iv: "aaaaaabaaaaaaaaa",//<-- 16 length
          }
     }
}