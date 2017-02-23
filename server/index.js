"use strict";

let jsonfile = require("jsonfile");
let URL = require('url-parse');

let ModScraper = require("./promisedScraper.js");
let exception = require("./Exception.js");
let checker = require("./checker.js");

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
// let checkDetailedInfoValidity = function(item, TYPE) {
//     return new Promise((fulfil, reject) => {

//         try {
//             expect(item).to.have.property("NameLink");
//             expect(item.NameLink).to.be.a("string");
//             expect(item.NameLink).to.not.be.empty;

//             expect(item).to.have.property("Name");
//             expect(item.Name).to.be.a("string");
//             expect(item.Name).to.not.be.empty;

//             expect(item).to.have.property("Description");
//             expect(item.Description).to.be.a("string");
//             expect(item.Description).to.not.be.empty;
//             expect(item.Description[item.Description.length - 1]).to.equal("."); //Each description must terminate with correct puntuation. I am freak rigth? xD

//             expect(item).to.have.property("PvPOnly");
//             expect(item.PvPOnly).to.be.a("boolean");

//             expect(item).to.have.property("Polarity");
//             expect(item.Polarity).to.be.a("string");
//             expect(TYPE.POLARITIES).to.include(item.Polarity);

//             expect(item).to.have.property("PolarityLink");
//             expect(item.PolarityLink).to.be.a("string");
//             expect(item.PolarityLink).to.not.be.empty;

//             expect(item).to.have.property("Rarity");
//             expect(item.Rarity).to.be.a("string");
//             expect(TYPE.RARITIES).to.include(item.Rarity);

//             if (!_.isUndefined(item.CategoryLink)) {
//                 expect(item.CategoryLink).to.be.a("string");
//                 expect(item.CategoryLink).to.not.be.empty;
//             }

//             expect(item).to.have.property("Category");
//             expect(item.Category).to.be.a("string");
//             expect(TYPE.CATEGORIES).to.include(item.Category);

//             fulfil();
//         }
//         catch (error) {
//             reject({
//                 exceptionName: "ValidityException",
//                 exception: error,
//                 item
//             });
//         }
//     });
// };

let checkData = function(mods) {
    const wikiaURL = new URL(scrapperCfg.sources.wikia.link);

    let check = checker({
        rarities: ["Common", "Uncommon", "Rare", "Legendary", "Riven"],
        polarities: ["Vazarin", "Madurai", "Naramon", "Zenurik"],
        categories: ["None", "Acolyte", "Corrupted", "Nightmare"]
    });

    for (let item of mods) {

        check.hasOverviewInfoValidity(item)
            // .then(() => {
            //     console.log("checked item validaty" + item.Name);
            // })
            .then(() => check.hasOverviewInfoAccuracy(item, wikiaURL))
            .then(() => {
                console.log("checked item accuracy" + item.Name);
            })
            .catch(info => {
                console.log("Error ocurred with: " + item.Name);
                createLog(info);
            });


        // checkAccuracy(item, wikiaURL);
        // checkConsistency(item, wikiaURL);

        /**
         *  1. Do I have this in the DB?
         *  1.1 No? Save it with timestamp.
         *  1.2 Yes? Compare to DB version and save if different. Update timestamp.
         */
    }

    return true;
};

//Get General information from mod tables
scrapy.getWarframeMods()
    .then(checkData)
    .catch(console.log);