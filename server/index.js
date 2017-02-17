// "use strict";

let jsonfile = require("jsonfile");
let Promise = require("promise");
let URL = require('url-parse');
let chai = require("chai"),
    expect = chai.expect;
let _ = require("underscore");
let HTTPStatus = require('http-status');
let superagent = require("superagent");
let values = require("object.values");

let ModScraper = require("./promisedScraper.js");
let exception = require("./Exception.js");

const CONFIG_FILES = {
    SCRAPPER: "./configs/scraperConfig.json",
    SERVER: "./configs/serverConfig.json"
};

let errorParams = jsonfile.readFileSync(CONFIG_FILES.SERVER).errorHandling;
let scrapperCfg = jsonfile.readFileSync(CONFIG_FILES.SCRAPPER);
let scrapy = new ModScraper(scrapperCfg);


// let getURLsList = function(modsList) {
//     let urlList = [];

//     for (let mod of modsList)
//         urlList.push(mod.NameLink);

//     return urlList;
// };

// let makeBatchRequest = function(linksList) {
//     let promisesArray = [];

//     let wikiaURL = URL(scrapy.config.sources.wikia.link, true);

//     for (let link of linksList) {
//         promisesArray.push(scrapy.getModInformation(wikiaURL.protocol + "//" + wikiaURL.hostname + link));
//     }

//     return new Promise.all(promisesArray);
// };

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
    }
    catch (error) {
        errorParams.exceptionName = "ValidityException";
        exception(errorParams).write(error);
    }
};

let checkAccuracy = function(item) {
    let wikiaUri = scrapperCfg.sources.wikia.link;
    // let wikiaPages = values(scrapperCfg.sources.wikia.pages);
    // let completeUri;
    
    superagent.get(wikiaUri + item.NameLink, (error, res) => {
        expect(error).to.not.exist;
        expect(res.status).to.equal(HTTPStatus.OK);
    });

    superagent.get(item.PolarityLink, (error, res) => {
        expect(error).to.not.exist;
        expect(res.status).to.equal(HTTPStatus.OK);
    });

    if (!_.isUndefined(item.CategoryLink)) {
        superagent.get(wikiaUri + item.CategoryLink, (error, res) => {
            expect(error).to.not.exist;
            expect(res.status).to.equal(HTTPStatus.OK);
        });
    }
}

//Do different sources report the same informaiton about the same item?
let checkConsistency = function(item) {
    
};

let checkData = function(mods) {

    for (let item of mods) {
        checkValidity(item);
        checkAccuracy(item);
        // expect(item).to.have.property("NameLink");
        // expect(item.NameLink).to.be.a("string");
        // expect(item.NameLink).to.not.be.empty;

        // superagent.get(wikiaUri + item.NameLink, (error, res) => {
        //     expect(error).to.not.exist;
        //     expect(res.status).to.equal(HTTPStatus.OK);
        // });

        // expect(item).to.have.property("Name");
        // expect(item.Name).to.be.a("string");
        // expect(item.Name).to.not.be.empty;

        // expect(item).to.have.property("Description");
        // expect(item.Description).to.be.a("string");
        // expect(item.Description).to.not.be.empty;
        // expect(item.Description[item.Description.length - 1]).to.equal("."); //Each description must terminate with correct puntuation. I am freak rigth? xD

        // expect(item).to.have.property("PvPOnly");
        // expect(item.PvPOnly).to.be.a("boolean");

        // expect(item).to.have.property("Polarity");
        // expect(item.Polarity).to.be.a("string");
        // expect(TYPE.POLARITIES).to.include(item.Polarity);

        // expect(item).to.have.property("PolarityLink");
        // expect(item.PolarityLink).to.be.a("string");
        // expect(item.PolarityLink).to.not.be.empty;
        // superagent.get(item.PolarityLink, (error, res) => {
        //     expect(error).to.not.exist;
        //     expect(res.status).to.equal(HTTPStatus.OK);
        // });

        // expect(item).to.have.property("Rarity");
        // expect(item.Rarity).to.be.a("string");
        // expect(TYPE.RARITIES).to.include(item.Rarity);

        // if (item.CategoryLink) {
        //     expect(item.CategoryLink).to.be.a("string");
        //     expect(item.CategoryLink).to.not.be.empty;
        //     superagent.get(wikiaUri + item.CategoryLink, (error, res) => {
        //         expect(error).to.not.exist;
        //         expect(res.status).to.equal(HTTPStatus.OK);
        //     });
        // }

        // expect(item).to.have.property("Category");
        // expect(item.Category).to.be.a("string");
        // expect(TYPE.CATEGORIES).to.include(item.Category);
    }
};

//Get General information from mod tables
scrapy.getWarframeMods()
    .then(checkData)
    .then(() => console.log("Data check complete, saving to DB"))
    .catch(console.log);


// // get detailed information for each mod
// scrapy.getWarframeMods()
//     .then(getURLsList)
//     .then(makeBatchRequest)
//     .then(modsDetailedInfo => writeOutput(FILE_NAME.WARFRAME_MODS_INFO, modsDetailedInfo))
//     .then(() => console.log(FILE_NAME.WARFRAME_MODS_INFO + " completed."))
//     .catch(console.log);