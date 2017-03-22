"use strict";

const chai = require("chai"),
    expect = chai.expect;
const serializeError = require('serialize-error');

const validityCheck = require("../validityChecker.js");
const accuracyCheck = require("../accuracyChecker.js");
const execute = require("../../utils/mapExecution.js");

//TODO: check for PvE / PvP mods
let warframeChecker = function(args) {
    let {
        wikiaURL,
        rarities,
        polarities
    } = args;

    let {
        hasValidStringProp,
        hasValidURLProp,
        hasValidNumberProp,
        hasValidBooleanProp,
        isKnownTypeProp,
        hasValidArrayProp,
        isValidURL
    } = validityCheck();

    let {
        doesURLExist
    } = accuracyCheck(args);

    let validityError = function(mod, error, propInvolved) {
        return {
            exceptionName: "ValidityException",
            exception: {
                error,
                propInvolved
            },
            item: mod
        };
    };

    let accuracyError = function(mod, error, propInvolved, url) {
        /*
         *  I have to serialize the error because JSON.stringify will not 
         *  include the stack, message and other properties from the error and
         *  I need them for the logs. 
         */
        return {
            exceptionName: "AccuracyException",
            exception: {
                error: serializeError(error),
                propInvolved,
                url
            },
            item: mod
        };
    };

    let hasValidName = function(mod) {
        try {
            hasValidStringProp(mod, "Name");
        }
        catch (error) {
            throw validityError(mod, error, "Name");
        }
    };

    let hasValidDescription = function(mod) {
        /*
         * I could differentiate bewteen a missing 'Description' field or a
         * missing '.' at the end of the Description field, by putting each 
         * expect() in its own try/catch clause, but I don't think that level
         * of depth is needed.
         */
        try {
            hasValidStringProp(mod, "Description");

            //Each description must terminate with correct puntuation. I am freak rigth? xD
            expect(mod.Description[mod.Description.length - 1]).to.equal(".");
        }
        catch (error) {
            throw validityError(mod, error, "Description");
        }
    };

    let hasValidURL = function(mod) {
        try {
            hasValidURLProp(mod, "URL");
        }
        catch (error) {
            throw validityError(mod, error, "URL");
        }
    };

    let hasValidRarity = function(mod) {
        try {
            isKnownTypeProp(mod, "Rarity", rarities);
        }
        catch (error) {
            throw validityError(mod, error, "Rarity");
        }
    };

    let hasValidPolarity = function(mod) {
        try {
            isKnownTypeProp(mod, "Polarity", polarities);
        }
        catch (error) {
            throw validityError(mod, error, "Polarity");
        }
    };

    let hasValidTraddingTax = function(mod) {
        try {
            if (!isNaN(mod.TraddingTax))
                hasValidNumberProp(mod, "TraddingTax");
        }
        catch (error) {
            throw validityError(mod, error, "TraddingTax");
        }
    };

    let hasValidTransmutation = function(mod) {
        try {
            hasValidBooleanProp(mod, "Transmutable");
        }
        catch (error) {
            throw validityError(mod, error, "Transmutable");
        }
    };

    let hasValidRank = function(mod) {
        try {
            hasValidNumberProp(mod, "Ranks");
        }
        catch (error) {
            throw validityError(mod, error, "Ranks");
        }
    };

    let hasValidImageURL = function(mod) {
        try {
            hasValidURLProp(mod, "ImageURL");
        }
        catch (error) {
            throw validityError(mod, error, "ImageURL");
        }
    };

    let hasValidPvP = function(mod) {
        try {
            hasValidBooleanProp(mod, "isPvP");
        }
        catch (error) {
            throw validityError(mod, error, "isPvP");
        }
    };

    let hasValidPvE = function(mod) {
        try {
            hasValidBooleanProp(mod, "isPvE");
        }
        catch (error) {
            throw validityError(mod, error, "isPvE");
        }
    };

    let hasValidDrops = function(mod) {

        try {
            hasValidArrayProp(mod, "DroppedBy");

            for (let drop of mod.DroppedBy) {

                try {
                    hasValidStringProp(drop, "Name");
                }
                catch (error) {
                    throw validityError(mod, error, "DroppedBy.Name");
                }

                try {
                    hasValidArrayProp(drop, "Links");
                    for (let link of drop.Links)
                        isValidURL(wikiaURL + link);
                }
                catch (error) {
                    throw validityError(mod, error, "DroppedBy.Links");
                }

            }

        }
        catch (error) {
            if (error.exception === undefined)
                throw validityError(mod, error, "DroppedBy");
            else
                throw error;
        }
    };

    let isValid = function(mod) {
        return execute([
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
        ], mod);
    };

    let hasAccurateImageUrl = function(mod) {
        return doesURLExist(mod.ImageURL)
            .catch(error => {
                throw accuracyError(mod, error, "ImageUrl", mod.ImageURL);
            });
    };

    //check all the links on dropped by actually work
    let hasAccurateDroppedByLinks = function(mod) {
        let promises = [];

        for (let drop of mod.DroppedBy) {
            for (let link of drop.Links) {

                let url;
                try {
                    isValidURL(link);
                    url = link;
                }
                catch (error) {
                    url = wikiaURL + link;
                }

                let result = doesURLExist(url)
                    .catch(error => {
                        throw accuracyError(mod, error, "DroppedBy.Links", url);
                    });
                promises.push(result);
            }
        }
        return Promise.all(promises);
    };

    let isAccurate = function(mod) {
        return execute([
            hasAccurateImageUrl,
            hasAccurateDroppedByLinks
        ], mod);
    };

    return Object.freeze({
        isValid,
        isAccurate
    });
};

module.exports = warframeChecker;