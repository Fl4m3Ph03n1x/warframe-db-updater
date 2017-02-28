"use strict";

let Promise = require("promise");
let URL = require('url-parse');
let chai = require("chai"),
    expect = chai.expect;

//VALUE OBJECT COMPOSITION OVER HIERARCHY
//Does the item conform to our DB schema?
let validityCheckerFactory = function(args) {
    let {
        rarities,
        polarities
    } = args;

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

    let hasValidStringProp = function(mod, propName) {
        return new Promise((fulfil, reject) => {
            try {
                expect(mod).to.have.property(propName);
                expect(mod[propName]).to.be.a("string");
                expect(mod[propName]).to.not.be.empty;
                fulfil();
            }
            catch (error) {
                reject(validityError(mod, error, propName));
            }
        });
    };

    let hasValidURLProp = function(mod, propName) {

        //http://stackoverflow.com/a/3809435/1337392
        let urlRegex = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;

        return new Promise((fulfil, reject) => {
            try {
                expect(mod).to.have.property(propName);
                expect(mod[propName]).to.be.a("string");
                expect(mod[propName]).to.not.be.empty;
                expect(mod[propName]).to.match(urlRegex);
                fulfil();
            }
            catch (error) {
                reject(validityError(mod, error, propName));
            }
        });
    };

    let hasValidNumberProp = function(mod, propName) {
        return new Promise((fulfil, reject) => {
            try {
                expect(mod).to.have.property(propName);
                expect(mod[propName]).to.be.a("number");
                expect(mod[propName]).not.to.be.NaN;
                expect(mod[propName]).to.be.above(0);
                fulfil();
            }
            catch (error) {
                reject(validityError(mod, error, propName));
            }
        });
    };

    let hasValidBooleanProp = function(mod, propName) {
        return new Promise((fulfil, reject) => {
            try {
                expect(mod).to.have.property(propName);
                expect(mod[propName]).to.be.a("boolean");
                fulfil();
            }
            catch (error) {
                reject(validityError(mod, error, propName));
            }
        });
    };

    let isKnownTypeProp = function(mod, propName, anArray) {
        return hasValidStringProp(mod, propName)
            .then(() => {
                expect(anArray).to.include(mod[propName]);
            })
            .catch(error => {
                throw validityError(mod, error, propName);
            });
    };

    let hasValidArrayProp = function(mod, propName) {
        return new Promise((fulfil, reject) => {
            try {
                expect(mod).to.have.property(propName);
                expect(mod[propName]).to.be.an("Array");
                fulfil();
            }
            catch (error) {
                reject(validityError(mod, error, propName));
            }
        });
    };

    let hasValidName = function(mod) {
        return hasValidStringProp(mod, "Name");
    };

    let hasValidDescription = function(mod) {
        return hasValidStringProp(mod, "Description")
            .then(() => {
                //Each description must terminate with correct puntuation. I am freak rigth? xD
                expect(mod.Description[mod.Description.length - 1]).to.equal(".");
            })
            .catch(error => {
                throw validityError(mod, error, "Description");
            });
        //catch something!
    };

    let hasValidURL = function(mod) {
        return hasValidURLProp(mod, "URL");
    };

    let hasValidRarity = function(mod) {
        return isKnownTypeProp(mod, "Rarity", rarities);
    };

    let hasValidPolarity = function(mod) {
        return isKnownTypeProp(mod, "Polarity", polarities);
    };

    let hasValidTraddingTax = function(mod) {
        return new Promise((fulfil, reject) => {
            if (!isNaN(mod.TraddingTax))
                return hasValidNumberProp(mod, "TraddingTax");
            else
                fulfil();
        });
    };

    let hasValidTransmutable = function(mod) {
        return hasValidBooleanProp("Transmutable");
    };

    let hasValidRank = function(mod) {
        return hasValidNumberProp(mod, "Ranks");
    };

    let hasValidImageURL = function(mod) {
        return hasValidURLProp(mod, "ImageURL");
    };

    let hasValidPvP = function(mod) {
        return hasValidBooleanProp(mod, "isPvP");
    };

    let hasValidPvE = function(mod) {
        return hasValidBooleanProp(mod, "isPvE");
    };

    //TODO: finish this one
    let hasValidDrops = function(mod) {
        return hasValidArrayProp(mod, "DroppedBy");
    };

    return Object.freeze({
        rarities,
        polarities,
        hasValidName,
        hasValidDescription,
        hasValidURL,
        hasValidRarity,
        hasValidPolarity,
        hasValidTraddingTax,
        hasValidTransmutable,
        hasValidRank,
        hasValidImageURL,
        hasValidPvP,
        hasValidPvE,
        hasValidDrops
    });
};

module.exports = validityCheckerFactory;