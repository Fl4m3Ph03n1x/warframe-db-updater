"use strict";

const chai = require("chai"),
    expect = chai.expect;
const serializeError = require('serialize-error');

const validityCheck = require("../validityChecker.js");
const accuracyCheck = require("../accuracyChecker.js");
const consistencyCheck = require("../consistencyChecker.js");
const execute = require("../../utils/mapExecution.js");

const warframeIndexTableChecker = function(args) {
    const {
        wikiaURL,
        rarities,
        polarities,
        subcategories
    } = args;

    const {
        hasValidStringProp,
        hasValidURLProp,
        hasValidBooleanProp,
        isKnownTypeProp,
        isValidURL,
        doesArrayContainValidProps
    } = validityCheck();

    const {
        doesURLExist
    } = accuracyCheck(args);

    const {
        arePropertiesConsistent
    } = consistencyCheck();

    const validityError = function(mod, error, propInvolved) {
        return {
            exceptionName: "ValidityException",
            exception: {
                error,
                propInvolved
            },
            item: mod
        };
    };

    const accuracyError = function(mod, error, propInvolved, url) {
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

    const consistencyError = function(indexInfo, detailedInfo, error, propInvolved) {
        return {
            exceptionName: "ConsistencyException",
            exception: {
                error,
                propInvolved
            },
            item: {
                indexInfo,
                detailedInfo
            }
        };
    };

    const hasValidNameLink = function(mod) {
        try {
            hasValidStringProp(mod, "nameLink");
            isValidURL(wikiaURL + mod.nameLink);
        }
        catch (error) {
            throw validityError(mod, error, "nameLink");
        }
    };

    const hasValidName = function(mod) {
        try {
            hasValidStringProp(mod, "name");
        }
        catch (error) {
            throw validityError(mod, error, "name");
        }
    };

    const hasValidDescription = function(mod) {
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

    const hasValidPvPOnly = function(mod) {
        try {
            hasValidBooleanProp(mod, "pvpOnly");
        }
        catch (error) {
            throw validityError(mod, error, "pvpOnly");
        }
    };

    const hasValidPolarity = function(mod) {
        try {
            isKnownTypeProp(mod, "polarity", polarities);
        }
        catch (error) {
            throw validityError(mod, error, "polarity");
        }
    };

    const hasValidPolarityLink = function(mod) {
        try {
            hasValidURLProp(mod, "polarityLink", polarities);
        }
        catch (error) {
            throw validityError(mod, error, "polarityLink");
        }
    };

    const hasValidRarity = function(mod) {
        try {
            isKnownTypeProp(mod, "rarity", rarities);
        }
        catch (error) {
            throw validityError(mod, error, "rarity");
        }
    };

    const hasValidSubcategory = function(mod) {

        if (mod.subcategory !== "None") {
            try {
                isKnownTypeProp(mod, "subcategory", subcategories);
            }
            catch (error) {
                throw validityError(mod, error, "subcategory");
            }
        }

    };

    const hasValidSubcategoryLink = function(mod) {

        if (mod.subcategory !== "None") {
            try {
                isValidURL(wikiaURL + mod.subcategoryLink);
            }
            catch (error) {
                throw validityError(mod, error, "subcategoryLink");
            }
        }
    };
    
    //will blow up
    const hasValidSyndicate = function(mod) {

        if (mod.syndicate !== undefined) {
            try {
                doesArrayContainValidProps(mod, "syndicate", []);
            }
            catch (error) {
                throw validityError(mod, error, "syndicate");
            }
        }

    };

    const hasValidSyndicateLink = function(mod) {

        if (mod.syndicate !== undefined) {
            try {
                isValidURL(wikiaURL + mod.syndicateLink);
            }
            catch (error) {
                throw validityError(mod, error, "syndicateLink");
            }
        }
    };

    const hasValidGameModes = mod => {

        try {
            doesArrayContainValidProps(mod, "gameModes", ["PvE", "PvP", "Archwing"]);
        }
        catch (error) {
            throw validityError(mod, error, "gameModes");
        }
    };

    let isValid = function(mod) {
        return execute([
            hasValidNameLink,
            hasValidName,
            hasValidDescription,
            hasValidPvPOnly,
            hasValidPolarity,
            hasValidPolarityLink,
            hasValidRarity,
            hasValidSubcategory,
            hasValidSubcategoryLink,
            // hasValidGameModes,
            // hasValidSyndicate,
            // hasValidSyndicateLink
        ], mod);
    };

    let hasAccurateNameLink = function(mod) {
        return doesURLExist(wikiaURL + mod.nameLink)
            .catch(error => {
                throw accuracyError(mod, error, "nameLink", mod.nameLink);
            });
    };

    let hasAccurateSubcategoryLink = function(mod) {
        if (mod.subcategoryLink !== undefined) {
            return doesURLExist(wikiaURL + mod.subcategoryLink)
                .catch(error => {
                    throw accuracyError(mod, error, "subcategoryLink", mod.subcategoryLink);
                });
        }
    };

    let isAccurate = function(mod) {
        return execute([
            hasAccurateNameLink,
            hasAccurateSubcategoryLink
        ], mod);
    };

    //TODO: Check nameLink === URL !
    //TODO: Check subcategory is the right one!
    let isModConsistent = function(indexInfo, detailInfo) {
        try {
            arePropertiesConsistent(indexInfo.name, detailInfo.name);
        }
        catch (error) {
            throw consistencyError(indexInfo, detailInfo, error, "name");
        }

        try {
            arePropertiesConsistent(indexInfo.polarity, detailInfo.polarity);
        }
        catch (error) {
            throw consistencyError(indexInfo, detailInfo, error, "polarity");
        }

        try {
            arePropertiesConsistent(indexInfo.rarity, detailInfo.rarity);
        }
        catch (error) {
            throw consistencyError(indexInfo, detailInfo, error, "rarity");
        }
    };

    let isSubcategoryConsistent = function(indexInfo, detailInfo) {

    };

    let isConsistent = function(indexInfo, detailInfo) {
        return execute([
            isModConsistent,
            isSubcategoryConsistent
        ], indexInfo, detailInfo);
    };

    return Object.freeze({
        isValid,
        isAccurate,
        isConsistent
    });
};

module.exports = warframeIndexTableChecker;