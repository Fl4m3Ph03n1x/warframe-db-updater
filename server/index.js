"use strict";

let jsonfile = require("jsonfile");
let Promise = require("promise");
let URL = require('url-parse');
let chai = require("chai"),
    expect = chai.expect;
let _ = require("underscore");
let HTTPStatus = require('http-status');
let superagent = require("superagent");

let ModScraper = require("./promisedScraper.js");
let exception = require("./Exception.js");

const CONFIG_FILES = {
    SCRAPPER: "./configs/scraperConfig.json",
    SERVER: "./configs/serverConfig.json"
};

let errorParams = jsonfile.readFileSync(CONFIG_FILES.SERVER).errorHandling;
let scrapperCfg = jsonfile.readFileSync(CONFIG_FILES.SCRAPPER);
let scrapy = new ModScraper(scrapperCfg);


let createLog = function(info) {
    errorParams.exceptionName = info.exceptionName;
    exception(errorParams).write({
        exception: info.exception,
        item: info.item
    });
};

//Does the item conform to our DB schema?
let checkValidity = function(item) {
    const TYPE = {
        RARITIES: ["Common", "Uncommon", "Rare", "Legendary", "Riven"],
        POLARITIES: ["Vazarin", "Madurai", "Naramon", "Zenurik"],
        CATEGORIES: ["None", "Acolyte", "Corrupted", "Nightmare"]
    };

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
        expect(TYPE.POLARITIES).to.include(item.Polarity);

        expect(item).to.have.property("PolarityLink");
        expect(item.PolarityLink).to.be.a("string");
        expect(item.PolarityLink).to.not.be.empty;

        expect(item).to.have.property("Rarity");
        expect(item.Rarity).to.be.a("string");
        expect(TYPE.RARITIES).to.include(item.Rarity);

        if (!_.isUndefined(item.CategoryLink)) {
            expect(item.CategoryLink).to.be.a("string");
            expect(item.CategoryLink).to.not.be.empty;
        }

        expect(item).to.have.property("Category");
        expect(item.Category).to.be.a("string");
        expect(TYPE.CATEGORIES).to.include(item.Category);

        return true;
    }
    catch (error) {
        createLog({
            exceptionName: "ValidityException",
            exception: error,
            item
        });
    }

    return false;
};

//Do this values depict reality? AKA, are the links and other info existent?
/**
 *  Return true or false once all the requests are complete. PROMISIFY!
 */
let checkAccuracy = function(item) {
    const wikiaURL = new URL(scrapperCfg.sources.wikia.link);

    superagent.get(wikiaURL.origin + item.NameLink, (error, res) => {
        try {
            expect(error).to.not.exist;
            expect(res.status).to.equal(HTTPStatus.OK);
        }
        catch (error) {
            createLog({
                exceptionName: "AccuracyException",
                exception: error,
                item
            });
        }

    });

    superagent.get(item.PolarityLink, (error, res) => {

        try {
            expect(error).to.not.exist;
            expect(res.status).to.equal(HTTPStatus.OK);
        }
        catch (error) {
            createLog({
                exceptionName: "AccuracyException",
                exception: error,
                item
            });
        }
    });

    if (!_.isUndefined(item.CategoryLink)) {
        superagent.get(wikiaURL.origin + item.CategoryLink, (error, res) => {
            try {
                expect(error).to.not.exist;
                expect(res.status).to.equal(HTTPStatus.OK);
            }
            catch (error) {
                createLog({
                    exceptionName: "AccuracyException",
                    exception: error,
                    item
                });
            }
        });
    }
};

//Do different sources report the same informaiton about the same item?
/**
 *  Return true or false once all the requests are complete. PROMISIFY!
 */
let checkConsistency = function(item) {
    /**
     * 1. Make request to item URL
     * 2. Scrap data from that page
     * 3. Compare data from page with item data
     */
};

let checkData = function(mods) {

    for (let item of mods) {
        checkValidity(item);
        checkAccuracy(item);
        checkConsistency(item);

        /**
         *  1. Do I have this in the DB?
         *  1.1 No? Save it with timestamp.
         *  1.2 Yes? Compare to DB version and save if different. Update timestamp.
         */
    }
};

//Get General information from mod tables
scrapy.getWarframeMods()
    .then(checkData)
    .catch(console.log);


// // get detailed information for each mod
// scrapy.getWarframeMods()
//     .then(getURLsList)
//     .then(makeBatchRequest)
//     .then(modsDetailedInfo => writeOutput(FILE_NAME.WARFRAME_MODS_INFO, modsDetailedInfo))
//     .then(() => console.log(FILE_NAME.WARFRAME_MODS_INFO + " completed."))
//     .catch(console.log);