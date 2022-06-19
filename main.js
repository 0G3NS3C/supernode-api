const server  = require('./src/server.js');
const { PERFORMANCE } = require('./src/server/utils.js');
let t0 = PERFORMANCE();
var cluster = require('cluster');
// if (cluster.isMaster) {
//     cluster.fork();
//
//     cluster.on('exit', function(worker, code, signal) {
//         cluster.fork();
//     });
// }
// if (cluster.isWorker) {

    console.log('--- SuperNode start ---');
    server.prepare()
        .then((API) => {
            if (API) {
                server.build({ API })
                    .then((http) => {
                        if (http) {
                            server.start({ API, http })
                                .then((status) => {
                                    if (status) console.log(`--- SuperNode end ( ${PERFORMANCE(t0)}ms ) ---`);
                                })
                        }
                    })
            }
        })

// }

/******************* MAIN PROTOTYPES ***************/

if (!('toJSON' in Error.prototype))
  Object.defineProperty(Error.prototype, 'toJSON', {
    value: function () {
      var alt = {};

      Object.getOwnPropertyNames(this).forEach(function (key) {
        alt[key] = this[key];
      }, this);

      return alt;
    },
    configurable: true,
    writable: true
  });


/********** THIS IS FOR CLUSTER !!!!!!! *********/


// var cluster = require('cluster');
// cluster.schedulingPolicy = cluster.SCHED_RR;
// if(cluster.isMaster){
//   var cpuCount = require('os').cpus().length;
//   for (var i = 0; i < cpuCount; i += 1) {
//     cluster.fork();
//   }
// }else{

//  	/* FUNCTIONS TO CLUSTER */
// }
// cluster.on('fork', function(worker) {
// console.log('forked -> Worker %d', worker.id);
// });