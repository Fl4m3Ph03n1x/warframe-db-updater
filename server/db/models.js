"use strict";

const mongoose = require("mongoose");

/**
 *  Module responsible for initializing the Models.   
 */
module.exports = (function() {
    let models;

    const initialize = () => {

        //Connect to DB
        mongoose.connect(require("../configs/dbConfig.json").connectionString);
        mongoose.Promise = global.Promise;

        //Build Models Object
        models = {
            IndexTable: mongoose.model("indexTable", require("../schemas/indexTableSchema.js")),
            WarframeMod: mongoose.model("warframeModSchema", require("../schemas/warframeModSchema.js"))
        };

    };

    const getModels = () => {
        if (models === undefined)
            initialize();

        return models;
    };

    return Object.freeze({
        getModels
    });
}());