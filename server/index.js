"use strict";

let jsonfile = require("jsonfile");
let URL = require('url-parse');

let ModScraper = require("./promisedScraper.js");
let exception = require("./Exception.js");
let checker = require("./checker.js");

let warframeChecker = require("./checkers/warframeChecker.js");

const CONFIG_FILES = {
    SCRAPPER: "./configs/scraperConfig.json",
    SERVER: "./configs/serverConfig.json"
};

let errorParams = jsonfile.readFileSync(CONFIG_FILES.SERVER).errorHandling;
let waitParams = jsonfile.readFileSync(CONFIG_FILES.SERVER).minIntervalWaits;
let scrapperCfg = jsonfile.readFileSync(CONFIG_FILES.SCRAPPER);
let scrapy = new ModScraper(scrapperCfg);

let createLog = function(info) {
    errorParams.exceptionName = info.exceptionName;
    exception(errorParams).write({
        exception: info.exception,
        item: info.item
    });
};

let getRandomArbitrary = function(min, max) {
    return Math.random() * (max - min) + min;
};

let checkData = function(mods) {
    const wikiaURL = new URL(scrapperCfg.sources.wikia.link);

    let dataTypes = {
        rarities: ["Common", "Uncommon", "Rare", "Legendary", "Riven"],
        polarities: ["Vazarin", "Madurai", "Naramon", "Zenurik", "Penjaga", "Unairu"],
        categories: ["None", "Acolyte", "Corrupted", "Nightmare"]
    };

    let check = checker(dataTypes);

    let checkWarframeMod = warframeChecker(dataTypes);

    let fullCheck = [];

    for (let item of mods) {


        fullCheck.push(
            scrapy.getModInformation(wikiaURL.origin + item.NameLink)
            .then(checkWarframeMod.isValid)
            .catch(info => {
                console.log("Error ocurred with: " + item.Name);
                createLog(info);
            }));
            
        // fullCheck.push(
        //     check.hasOverviewInfoValidity(item)
        //     .then(() => check.hasOverviewInfoAccuracy(item, wikiaURL))
        //     .then(() => check.hasOverviewInfoConsistency(item, wikiaURL, scrapy))
        //     // .then(() => checkWarframeMod.hasValidName(item))
        //     .catch(info => {
        //         console.log("Error ocurred with: " + item.Name);
        //         createLog(info);
        //     })
        // );

        /**
         *  1. Check detailed item validity
         *  2. Check detailed item accuracy
         *  3. Do I have item in the DB?
         *  3.1 No? Save it with timestamp.
         *  3.2 Yes? Compare to DB version and save if different. Update timestamp.
         */
    }

    return Promise.all(fullCheck);
};

let cycle = function() {
    console.log("calling");

    scrapy.getWarframeMods()
        .then(checkData)
        .then(() => console.log("checked Warframe data"))
        .catch(console.log);

    // scrapy.getRifleMods()
    //     .then(checkData)
    //     .then(() => console.log("checked Rifle data"))
    //     .catch(console.log);

    // scrapy.getPistolMods()
    //     .then(checkData)
    //     .then(() => console.log("checked Pistol data"))
    //     .catch(console.log);

    // scrapy.getShotgunMods()
    //     .then(checkData)
    //     .then(() => console.log("checked Shotgun data"))
    //     .catch(console.log);

    // scrapy.getMeleeMods()
    //     .then(checkData)
    //     .then(() => console.log("checked Melee data"))
    //     .catch(console.log);

    // scrapy.getAuraMods()
    //     .then(checkData)
    //     .then(() => console.log("checked Aura data"))
    //     .catch(console.log);

    // scrapy.getSentinelMods()
    //     .then(checkData)
    //     .then(() => console.log("checked Sentinel data"))
    //     .catch(console.log);

    // scrapy.getKubrowMods()
    //     .then(checkData)
    //     .then(() => console.log("checked Kubrow data"))
    //     .catch(console.log);

    // scrapy.getStanceMods()
    //     .then(checkData)
    //     .then(() => console.log("checked Stance data"))
    //     .catch(console.log);
};


cycle();
// setInterval(cycle, waitParams.cycles);//from seconds to miliseconds
