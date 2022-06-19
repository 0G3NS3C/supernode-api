
module.exports = {
      CONSOLE: {
            DEFAULT(msg) { 
              // process.stdout.moveCursor(0, -1) // up one line
              // process.stdout.clearLine(1) // from cursor to end
             console.log("\x1b[37m\x1b[40m "+msg+" \x1b[0m ") },
            ERROR(msg) {      console.log("\x1b[37m\x1b[31m "+msg+" \x1b[0m "); },
            WARNING(msg) { console.log("\x1b[43m\x1b[31m "+msg+" \x1b[0m "); },
            FATAL_ERROR(msg) {
                  console.log('\x1b[37m\x1b[31m-------------- ERROR --------------');
                  console.log("\x1b[37m\x1b[31m "+msg+" \x1b[0m "); 
                  console.log('\x1b[37m\x1b[31m----------------------------------');
                  process.exit()
            },
            MSG(msg) {  console.log("\x1b[30m \x1b[47m --> "+msg+" \x1b[0m "); }          
      },
      PERFORMANCE: function(a=null) {
            if (!a) return process.hrtime();
            else {
                  let e = process.hrtime(a);
                  return Math.round((e[0]*1000) + (e[1]/1000000));
            }
      },
      capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
      }
}

