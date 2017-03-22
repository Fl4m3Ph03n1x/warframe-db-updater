"use strict";

const chai = require("chai"),
    expect = chai.expect;
const serializeError = require('serialize-error');

const validityCheck = require("./validityChecker.js");
const accuracyCheck = require("./accuracyChecker.js");
const consistencyCheck = require("./consistencyChecker.js");
const execute = require("../utils/mapExecution.js");

let warframeIndexTableChecker = function(args) {
    let {
        wikiaURL,
        rarities,
        polarities,
        subcategories
    } = args;

    let {
        hasValidStringProp,
        hasValidURLProp,
        hasValidBooleanProp,
        isKnownTypeProp,
        isValidURL
    } = validityCheck();

    let {
        doesURLExist
    } = accuracyCheck(args);

    let {
        arePropertiesConsistent
    } = consistencyCheck();

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

    let consistencyError = function(indexInfo, detailedInfo, error, propInvolved) {
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

    let hasValidNameLink = function(mod) {
        try {
            hasValidStringProp(mod, "NameLink");
            isValidURL(wikiaURL + mod.NameLink);
        }
        catch (error) {
            throw validityError(mod, error, "NameLink");
        }
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

    let hasValidPvPOnly = function(mod) {
        try {
            hasValidBooleanProp(mod, "PvPOnly");
        }
        catch (error) {
            throw validityError(mod, error, "PvPOnly");
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

    let hasValidPolarityLink = function(mod) {
        try {
            hasValidURLProp(mod, "PolarityLink", polarities);
        }
        catch (error) {
            throw validityError(mod, error, "PolarityLink");
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

    let hasValidSubcategory = function(mod) {

        if (mod.Subcategory !== undefined) {
            try {
                isKnownTypeProp(mod, "Subcategory", subcategories);
            }
            catch (error) {
                throw validityError(mod, error, "Subcategory");
            }
        }

    };

    let hasValidSubcategoryLink = function(mod) {

        if (mod.SubcategoryLink !== undefined) {
            try {
                isValidURL(wikiaURL + mod.SubcategoryLink);
            }
            catch (error) {
                throw validityError(mod, error, "SubcategoryLink");
            }
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
            hasValidSubcategoryLink
        ], mod);
    };
    
    let hasAccurateNameLink = function(mod) {
        return doesURLExist(wikiaURL + mod.NameLink)
            .catch(error => {
                throw accuracyError(mod, error, "NameLink", mod.NameLink);
            });
    };

    let hasAccurateSubcategoryLink = function(mod) {
        if (mod.SubcategoryLink !== undefined)
            return doesURLExist(wikiaURL + mod.SubcategoryLink)
                .catch(error => {
                    throw accuracyError(mod, error, "SubcategoryLink", mod.SubcategoryLink);
                });
    };

    let isAccurate = function(mod) {
        return execute([
            hasAccurateNameLink,
            hasAccurateSubcategoryLink
        ], mod);
    };

    //TODO: Check NameLink === URL !
    //TODO: Check Subcategory is the right one!
    let isModConsistent = function(indexInfo, detailInfo) {
        try {
            arePropertiesConsistent(indexInfo.Name, detailInfo.Name);
        }
        catch (error) {
            throw consistencyError(indexInfo, detailInfo, error, "Name");
        }

        try {
            arePropertiesConsistent(indexInfo.Polarity, detailInfo.Polarity);
        }
        catch (error) {
            throw consistencyError(indexInfo, detailInfo, error, "Polarity");
        }

        try {
            arePropertiesConsistent(indexInfo.Rarity, detailInfo.Rarity);
        }
        catch (error) {
            throw consistencyError(indexInfo, detailInfo, error, "Rarity");
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