"use strict";

let Promise = require("promise");
let URL = require('url-parse');
let chai = require("chai"),
    expect = chai.expect;
let _ = require("underscore");
let HTTPStatus = require('http-status');
let request = require("request");

let get = Promise.denodeify(request);

//VALUE OBJECT COMPOSITION OVER HIERARCHY
//Do this values depict reality? AKA, are the links and other info existent?
let accuracyCheckerFactory = function(args) {
    let {
        rarities,
        polarities
    } = args;

    let accuracyError = function(mod, error) {
        return {
            exceptionName: "AccuracyException",
            exception: error,
            item: mod
        };
    };
    
    let hasOverviewInfoAccuracy = function(item, wikiaURL) {

        let isRequestOk = response => {
            return expect(response.statusCode).to.equal(HTTPStatus.OK);
        };

        return get(wikiaURL.origin + item.NameLink)
            .then(isRequestOk)
            .then(() => get(item.PolarityLink))
            .then(isRequestOk)
            .then(() => {
                if (!_.isUndefined(item.CategoryLink))
                    return get(wikiaURL.origin + item.CategoryLink);

                return undefined;
            })
            .then(result => {
                if (result !== undefined)
                    return isRequestOk(result);
            })
            .catch(error => {
                throw {
                    exceptionName: "AccuracyException",
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

module.exports = accuracyCheckerFactory;