"use strict";

let Promise = require("promise");
let URL = require('url-parse');
let chai = require("chai"),
    expect = chai.expect;

//VALUE OBJECT COMPOSITION OVER HIERARCHY
//Does the item conform to our DB schema?
let consistencyCheckerFactory = function(args) {
    let {
        rarities,
        polarities
    } = args;

    let consistencyError = function(mod, error) {
        return {
            exceptionName: "ConsistencyException",
            exception: error,
            item: mod
        };
    };

    //Do different sources report the same informaiton about the same item?
    let hasOverviewInfoConsistency = function(item, wikiaURL, scrapy) {

        return scrapy.getModInformation(wikiaURL.origin + item.NameLink)
            .then(info => {
                expect(info.Name).to.equal(item.Name);
                expect(info.Polarity).to.equal(item.Polarity);
                expect(info.Rarity).to.equal(item.Rarity);
            })
            .catch(error => {
                throw {
                    exceptionName: "ConsistencyException",
                    exception: error,
                    item
                };
            });
    };

    return Object.freeze({
        rarities,
        polarities
    });
};

module.exports = consistencyCheckerFactory;