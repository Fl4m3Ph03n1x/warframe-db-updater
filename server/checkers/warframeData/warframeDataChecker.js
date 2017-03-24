"use strict";

//General Libs
const URL = require('url-parse');
const Promise = require("promise");

//Personal Libs
const logFactory = require("../../utils/logCreator.js");
const resultsChecker = require("../resultsChecker.js");
const warframeChecker = require("./warframeModChecker.js");
const warframeIndexTableChecker = require("./warframeIndexChecker.js");

let checkWarframeData = function(mods, args) {

    let {
        wikiaURL,
        scrapy
    } = args;

    let logger = logFactory(args);
    let checker = resultsChecker(logger);
    let checkWarframeIndex = warframeIndexTableChecker(args);
    let checkWarframeMod = warframeChecker(args);
    let fullCheck = [];

    for (let item of mods) {

        let itemCheck = checkWarframeIndex.isValid(item)
            .then(checker)
            .then(() => checkWarframeIndex.isAccurate(item))
            .then(checker)
            .then(() => scrapy.getModInformation(wikiaURL + item.NameLink))
            .then(details => {
                return checkWarframeMod.isValid(details)
                    .then(checker)
                    .then(() => checkWarframeMod.isAccurate(details))
                    .then(checker)
                    .then(() => checkWarframeIndex.isConsistent(item, details))
                    .then(checker)
                    .catch(error => {
                        console.log(error);
                    });
            })
            .catch(error => {
                logger.createServerLog(error);
            });

        fullCheck.push(itemCheck);
    }

    return Promise.all(fullCheck);
};

module.exports = checkWarframeData;