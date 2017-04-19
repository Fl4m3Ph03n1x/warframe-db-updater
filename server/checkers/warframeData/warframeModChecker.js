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
            hasValidStringProp(mod, "name");
        }
        catch (error) {
            throw validityError(mod, error, "name");
        }
    };

    let hasValidDescription = function(mod) {
        /*
         * I could differentiate bewteen a missing 'description' field or a
         * missing '.' at the end of the description field, by putting each 
         * expect() in its own try/catch clause, but I don't think that level
         * of depth is needed.
         */
        try {
            hasValidStringProp(mod, "description");

            //Each description must terminate with correct puntuation. I am freak rigth? xD
            expect(mod.description[mod.description.length - 1]).to.equal(".");
        }
        catch (error) {
            throw validityError(mod, error, "description");
        }
    };

    let hasValidURL = function(mod) {
        try {
            hasValidURLProp(mod, "url");
        }
        catch (error) {
            throw validityError(mod, error, "url");
        }
    };

    let hasValidRarity = function(mod) {
        try {
            isKnownTypeProp(mod, "rarity", rarities);
        }
        catch (error) {
            throw validityError(mod, error, "rarity");
        }
    };

    let hasValidPolarity = function(mod) {
        try {
            isKnownTypeProp(mod, "polarity", polarities);
        }
        catch (error) {
            throw validityError(mod, error, "polarity");
        }
    };

    let hasValidTraddingTax = function(mod) {
        try {
            if (!isNaN(mod.traddingTax))
                hasValidNumberProp(mod, "traddingTax");
        }
        catch (error) {
            throw validityError(mod, error, "traddingTax");
        }
    };

    let hasValidTransmutation = function(mod) {
        try {
            hasValidBooleanProp(mod, "transmutable");
        }
        catch (error) {
            throw validityError(mod, error, "transmutable");
        }
    };

    let hasValidRank = function(mod) {
        try {
            hasValidNumberProp(mod, "ranks");
        }
        catch (error) {
            throw validityError(mod, error, "ranks");
        }
    };

    let hasValidImageURL = function(mod) {
        try {
            hasValidURLProp(mod, "imageURL");
        }
        catch (error) {
            throw validityError(mod, error, "imageURL");
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
            hasValidArrayProp(mod, "droppedBy");

            for (let drop of mod.droppedBy) {

                try {
                    hasValidStringProp(drop, "name");
                }
                catch (error) {
                    throw validityError(mod, error, "droppedBy.name");
                }

                try {
                    hasValidArrayProp(drop, "links");
                    for (let link of drop.links)
                        isValidURL(wikiaURL + link);
                }
                catch (error) {
                    throw validityError(mod, error, "droppedBy.links");
                }

            }

        }
        catch (error) {
            if (error.exception === undefined)
                throw validityError(mod, error, "droppedBy");
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
        return doesURLExist(mod.imageURL)
            .catch(error => {
                throw accuracyError(mod, error, "imageUrl", mod.imageURL);
            });
    };

    //check all the links on dropped by actually work
    let hasAccurateDroppedByLinks = function(mod) {
        let promises = [];

        for (let drop of mod.droppedBy) {
            for (let link of drop.links) {

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
                        throw accuracyError(mod, error, "droppedBy.links", url);
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