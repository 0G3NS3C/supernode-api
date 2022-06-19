
const func = require("../func.js");
const nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');
var handlebars = require('handlebars');
var fs = require('fs');


var _transport = null;





var MailerManager = function(config){
    var configuration = config;

    /*
    email = Array;
    content: object {
                title: String,
                type: 'html'/'plain', 
                plain: '<html'>, 
                html: 'filename.html',
     }
     data: {} will be replace in html file or plain text file
     delay: Number before send email
                            */
 this.send= function(email,content,data,delay=null) {

    var transport = _getTransport();


    if (content.type == "template") {
        if (!content.template) { func._error('Mailer.js ERROR : type set to "template" but template name is null.'); return false; }
        var linktemplate = content.dir+"/"+content.template+".html";
        var lang = content.lang || "en";

        return  new Promise((resolve,reject) => {
            _readHTMLFile(linktemplate, function(err, html) {
            if (err) { func._error('Mailer.js ERROR: Can\'t find html template file : '+content.html); resolve(false); }

            var template = handlebars.compile(html);

            let text = fs.readFileSync(content.dir+'/text.json');  
            let textData = JSON.parse(text)[lang+"_"];  
        
            var replacements = extend({}, textData, data);
      
            var htmlToSend = template(replacements);
            var mailOptions = {
                from: configuration['from'],
                to : email.join(','),
                subject : replacements.title,
                html : htmlToSend
            };


        resolve(transport.sendMail(mailOptions));
        
        });
        })
    }else {
       var mailOptions = {
        from: configuration['from'],
        to : email.join(','),
        subject : content.title,
        text : content.plain
    };
   
  return transport.sendMail(mailOptions);
}
};

_getTransport= function() {
    if (!_transport) {
        var config = {
                host: configuration['host'],
                port: configuration['port'],
                secure: configuration['secure'],
                auth: {
                    user: configuration['auth'],
                    pass: configuration['password']
                }
            };
        _transport=nodemailer.createTransport(smtpTransport(config));

    }
    return _transport;
};



_readHTMLFile= function(path, callback) {
    fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
        if (err) {
            throw err;
            callback(err);
        }
        else {
            callback(null, html);
        }
    });
}




}

function extend(target) {
    var sources = [].slice.call(arguments, 1);
    sources.forEach(function (source) {
        for (var prop in source) {
            target[prop] = source[prop];
        }
    });
    return target;
}


module.exports = MailerManager;