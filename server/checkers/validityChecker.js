"use strict";

let Promise = require("promise");
let URL = require('url-parse');
let chai = require("chai"),
    expect = chai.expect;
let _ = require("underscore");

//VALUE OBJECT COMPOSITION OVER HIERARCHY
//Does the item conform tos our DB schema?
//TODO: remove all the promise behavior. If none of this is async, why use it?
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

    let hasValidTransmutation = function(mod) {
        return hasValidBooleanProp(mod, "Transmutable");
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

    let hasValidDrops = function(mod) {
        return hasValidArrayProp(mod, "DroppedBy")
            .then(() => {
                let promises = [];

                for (let drop of mod.DroppedBy) {
                    promises.push(
                        hasValidStringProp(drop, "Name")
                        .catch(error => {
                            validityError(drop, error, "DroppedBy.Name");
                        })
                    );

                    promises.push(
                        hasValidArrayProp(drop, "Links")
                        .then(() => {
                            for (let link of drop.Links) {
                                expect(link).to.be.a("string");
                                expect(link).to.not.be.empty;
                            }
                        })
                        .catch(error => {
                            validityError(drop, error, "DroppedBy.Links");
                        })
                    );
                }

                return Promise.all(promises);
            });
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
        hasValidTransmutation,
        hasValidRank,
        hasValidImageURL,
        hasValidPvP,
        hasValidPvE,
        hasValidDrops
    });
};

module.exports = validityCheckerFactory;