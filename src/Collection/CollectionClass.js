const { capitalizeFirstLetter } = require('../server/utils');

let timeoutSave = null;
let timeoutTime = 1000;

class CollectionClass  {
        constructor(document, schema) {
                //const { __v, ...preparedDocument } = document._doc;
                const preparedDocument = document._doc || document;
                delete preparedDocument['__v'];

                Object.keys(preparedDocument).forEach((index) => {
                        if (index === "_id") {
                                this['getID'] = () => document[index];
                        } else {
                                this['get' + capitalizeFirstLetter(index)] = () => (document[index]);
                        }

                        if (!['_id', '__v'].includes(index)) {
                                this['set' + capitalizeFirstLetter(index)] = async (value) => {
                                        document[index] = value;
                                        document.markModified(index);
                                        await this.save();
                                }
                        }
                })

                this.getObject = async function() {
                        let obj = {};
                        for (let index in schema) {
                             if (index === '_id')  obj[index] = this['getID']();
                             else if (this['get'+capitalizeFirstLetter(index)]) {
                                     obj[index] = await this['get'+capitalizeFirstLetter(index)]();
                             }
                             else { obj[index] = document[index]; }
                        }
                        return obj;
                }
                this.getDocumentModel = function() {
                        return document;
                }
                this.save = async function() {

                        // clearTimeout(timeoutSave);
                        // let _t = this;
                        // timeoutSave = setTimeout(function() {
                        await document.save().then((status) => {
                                        if (!status) {
                                                console.log('CollectionClass NOT saved .');
                                        }
                                        else {
                                                console.log('CollectionClass saved .');
                                        }

                                })
                        // },timeoutTime)

                }

                this.remove = function() {
                        clearTimeout(timeoutSave);
                        document.remove();
                }
        }
}

module.exports = CollectionClass;

 