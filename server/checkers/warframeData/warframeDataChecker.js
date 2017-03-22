"use strict";

//General Libs
const URL = require('url-parse');
const Promise = require("promise");

//Personal Libs
const logFactory = require("../../utils/logCreator.js");
const warframeChecker = require("./warframeModChecker.js");
const warframeIndexTableChecker = require("./warframeIndexChecker.js");

//TODO Apply Inversion of Control!
//https://www.youtube.com/watch?v=-kpEP4JeEdc
let checkResults = function(results, logger) {
    results
        .filter(result => result.state === "rejected")
        .forEach(obj => logger.createLog(obj.reason));
};

let checkWarframeData = function(mods, args) {

    let {
        wikiaURL,
        scrapy
    } = args;
    
    let logger =  logFactory(args);

    let checkWarframeIndex = warframeIndexTableChecker(args);
    let checkWarframeMod = warframeChecker(args);
    let fullCheck = [];

    for (let item of mods) {

        let check = checkWarframeIndex.isValid(item)
            .then(res => checkResults(res, logger))
            .then(() => checkWarframeIndex.isAccurate(item))
            .then(res => checkResults(res, logger))
            .then(() => scrapy.getModInformation(wikiaURL + item.NameLink))
            .then(details => {
                return checkWarframeMod.isValid(details)
                    .then(res => checkResults(res, logger))
                    .then(() => checkWarframeMod.isAccurate(details))
                    .then(res => checkResults(res, logger))
                    .then(() => checkWarframeIndex.isConsistent(item, details))
                    .then(res => checkResults(res, logger))
                    .catch(error => {
                        console.log(error);
                    });
            })
            .catch(error => {
                logger.createServerLog(error);
            });

        fullCheck.push(check);

        /**
         *  3. Do I have item in the DB?
         *  3.1 No? Save it with timestamp.
         *  3.2 Yes? Compare to DB version and save if different. Update timestamp.
         */
    }

    return Promise.all(fullCheck);
};

module.exports = checkWarframeData;