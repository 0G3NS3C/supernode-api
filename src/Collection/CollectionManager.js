const uuid = require('uuid');

let {CONSOLE} = require('../server/utils.js')

const RAM_ENTRIES = {};

const REGISTER_IN_RAM = (entry) => {
    RAM_ENTRIES[entry.getID()] = entry;
    return entry;
}

const GET_FROM_RAM = (entry) => {
    if (RAM_ENTRIES[entry.getID()]) return RAM_ENTRIES[entry.getID()];
    return false;
}

const REMOVE_FROM_RAM = (entry) => {
    if (RAM_ENTRIES[entry.getID()]) delete  RAM_ENTRIES[entry.getID()];
}

module.exports = function ({name, database, object, schema, config }) {
    // var RAM = [];
    let Controller = null;
    if (!object) object = require('./CollectionClass.js');

    if (database && schema && name) {
        Controller = database.createController(name, schema);
    }
    if (!Controller) return;

        this.getController = function () { return Controller; }

        this.create = function (data) {
            return new Promise((resolve, reject) => {
                Controller.create(data, function (error, entry) {
                    if (error || !entry) {
                        console.log(error);
                        reject(error);
                    } else {
                        if (object) entry = new object(entry, schema);
                        resolve(entry);
                    }
                })
            })
        }
    


    this.findOne = function (index, value = null) {

        return new Promise((resolve, reject) => {
            let target = {};
            if (typeof (index) === 'object' && !value) {
                target = index
            } else if (value) {
                target[index] = value
            } else {
                target = index
            }
            let targetJson = JSON.stringify(target);
            // if (RAM[targetJson]) resolve(RAM[targetJson]);
            Controller.findOne(target, function (error, entry) {
                if (error) {
                    reject(error)
                } else if (!entry) {
                    resolve(false);
                } else {
                    if (object) entry = new object(entry, schema);
                    resolve(entry);
                    // if (GET_FROM_RAM(entry)) { resolve(GET_FROM_RAM(entry)); }
                    // else {
                    //     resolve(REGISTER_IN_RAM(entry))
                    // }
                }
            })
        })
    }
    this.find = function (index, value = null) {
        return new Promise((resolve, reject) => {
            let target = {};
            if (typeof (index) === object && !value) {
                target = index
            } else if (value) {
                target[index] = value
            } else {
                target = index
            }
            Controller.find(target).limit(100).exec(function (error, entries) {
                if (error) {
                    reject(error)
                } else if (!entries) {
                    resolve(false);
                } else {

                    // for (let entry in entries) {
                    //     entries[entry] =  new object(entries[entry], schema);
                    //     if (GET_FROM_RAM(entries[entry])) entries[entry] = GET_FROM_RAM(entries[entry]);
                    //     else {
                    //         REGISTER_IN_RAM(entries[entry]);
                    //     }
                    // }
                    resolve(entries);
                }
            })
        })
    }

    this.findOneAndUpdate = function(index, data) {
        return new Promise((resolve, reject) => {
            Controller.findOneAndUpdate(index, data).exec(function (error, entry) {
                if (error) {
                    reject(error)
                } else if (!entry) {
                    resolve(false);
                } else {
                    resolve(entry);
                }
            })
        })
    }

    this.remove = function(document) {
        REMOVE_FROM_RAM(document);
        document.remove();
    }

    return this;


}

