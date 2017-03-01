"use strict";

let Promise = require("promise");
let validityCheck = require("./validityChecker.js");

//factory function
let warframeChecker = function(args) {
    let {
        hasValidName,
        hasValidDescription,
        hasValidURL,
        hasValidRarity,
        hasValidPolarity,
        hasValidTraddingTax,
        hasValidTransmutation,
        hasValidRank,
        hasValidImageURL,
        hasValidDrops
    } = validityCheck(args);

    let isValid = function(mod) {
        return Promise.all(
            [
                hasValidName(mod), 
                hasValidDescription(mod), 
                hasValidURL(mod),
                hasValidRarity(mod),
                hasValidPolarity(mod),
                hasValidTraddingTax(mod),
                hasValidTransmutation(mod),
                hasValidRank(mod),
                hasValidImageURL(mod),
                hasValidDrops(mod)
            ]
        );
    };

    let isAccurate = function(mod) {

    };

    let isConsistent = function(mod) {

    };

    return Object.freeze({
        isValid,
        isAccurate,
        isConsistent
    });
};

module.exports = warframeChecker;