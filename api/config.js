module.exports = {
  port: 1337,
  ssl: false,
  // SSL: {
  //   KEY: '/key.key',
  //   CERT:'/certificate.cer',
  //   CA: '/intermediate.cer'
  // },
  cache: {
    maxage: 3600000,
  },
  headers: {
   'Access-Control-Allow-Origin':  [
        '*',
   ],
   'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
   'Access-Control-Allow-Headers':'x-machine,x-session,Origin,Referer,Accept-Language,Cookie,User-Agent,Content-Type,Accept,X-Requested-With,Content-Type,Authorization',
   'Access-Control-Expose-Headers':'x-machine,x-session',
   'Access-Control-Allow-Credentials': true
},
  database: 'default',
  lang: 'fr',
}