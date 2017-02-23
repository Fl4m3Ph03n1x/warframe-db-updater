"use strict";

let Promise = require("promise");
let URL = require('url-parse');
let chai = require("chai"),
    expect = chai.expect;
let _ = require("underscore");
let HTTPStatus = require('http-status');
let request = require("request");

let get = Promise.denodeify(request);

let checkerFactory = function(args) {
    let {
        rarities,
        polarities,
        categories
    } = args;

    //Does the item conform to our DB schema?
    let hasOverviewInfoValidity = function(item) {
        return new Promise((fulfil, reject) => {
            try {
                expect(item).to.have.property("NameLink");
                expect(item.NameLink).to.be.a("string");
                expect(item.NameLink).to.not.be.empty;

                expect(item).to.have.property("Name");
                expect(item.Name).to.be.a("string");
                expect(item.Name).to.not.be.empty;

                expect(item).to.have.property("Description");
                expect(item.Description).to.be.a("string");
                expect(item.Description).to.not.be.empty;
                expect(item.Description[item.Description.length - 1]).to.equal("."); //Each description must terminate with correct puntuation. I am freak rigth? xD

                expect(item).to.have.property("PvPOnly");
                expect(item.PvPOnly).to.be.a("boolean");

                expect(item).to.have.property("Polarity");
                expect(item.Polarity).to.be.a("string");
                expect(polarities).to.include(item.Polarity);

                expect(item).to.have.property("PolarityLink");
                expect(item.PolarityLink).to.be.a("string");
                expect(item.PolarityLink).to.not.be.empty;

                expect(item).to.have.property("Rarity");
                expect(item.Rarity).to.be.a("string");
                expect(rarities).to.include(item.Rarity);

                if (!_.isUndefined(item.CategoryLink)) {
                    expect(item.CategoryLink).to.be.a("string");
                    expect(item.CategoryLink).to.not.be.empty;
                }

                expect(item).to.have.property("Category");
                expect(item.Category).to.be.a("string");
                expect(categories).to.include(item.Category);

                fulfil();
            }
            catch (error) {
                reject({
                    exceptionName: "ValidityException",
                    exception: error,
                    item
                });
            }
        });
    };

    //Do this values depict reality? AKA, are the links and other info existent?
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
            .then( result => {
                if(result !== undefined)
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


    // //Do different sources report the same informaiton about the same item?
    // /**
    //  *  Return true or false once all the requests are complete. PROMISIFY!
    //  */
    // let hasOverviewInfoConsistency = function(item, wikiaURL) {
    //     /**
    //      * 1. Make request to item URL
    //      * 2. Scrap data from that page
    //      * 3. Compare data from page with item data
    //      */

    //     scrapy.getModInformation(wikiaURL.origin + item.NameLink)
    //         .then(info => {
    //             expect(checkValidity(info)).to.equal(true);

    //         })
    //         .catch(error => {
    //             createLog({
    //                 exceptionName: "ConsistencyException",
    //                 exception: error,
    //                 item
    //             });
    //         });
    // };

    return Object.freeze({
        hasOverviewInfoValidity,
        hasOverviewInfoAccuracy
        // hasOverviewInfoConsistency
    });
};

module.exports = checkerFactory;