"use strict";

let jsonfile = require("jsonfile");
let URL = require('url-parse');
let request = require("request");
let Promise = require("promise");
const serializeError = require('serialize-error');

let ModScraper = require("./promisedScraper.js");
let exception = require("./Exception.js");
let sparse = require("./utils/sparse.js");
let warframeChecker = require("./checkers/warframeChecker.js");
let warframeIndexTableChecker = require("./checkers/warframeIndexTableChecker.js");

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

let createServerLog = function(error) {
    errorParams.exceptionName = "ServerError.json";
    exception(errorParams).write(serializeError(error));
};

let checkResults = function(results) {
    results
        .filter(result => result.state === "rejected")
        .forEach(obj => createLog(obj.reason));
};

let checkData = function(mods) {
    const wikiaURL = new URL(scrapperCfg.sources.wikia.link);
    const requestFun = sparse(Promise.denodeify(request), 50);
    const args = {
        rarities: ["Common", "Uncommon", "Rare", "Legendary", "Riven"],
        polarities: ["Vazarin", "Madurai", "Naramon", "Zenurik", "Penjaga", "Unairu"],
        subcategories: ["None", "Acolyte", "Corrupted", "Nightmare"],
        wikiaURL: wikiaURL.origin,
        requestFun
    };

    let checkWarframeIndex = warframeIndexTableChecker(args);
    let checkWarframeMod = warframeChecker(args);
    let fullCheck = [];

    for (let item of mods) {

        let check = checkWarframeIndex.isValid(item)
            .then(checkResults)
            .then(() => checkWarframeIndex.isAccurate(item))
            .then(checkResults)
            .then(() => scrapy.getModInformation(wikiaURL.origin + item.NameLink))
            .then(details => {
                return checkWarframeMod.isValid(details)
                    .then(checkResults)
                    .then(() => checkWarframeMod.isAccurate(details))
                    .then(checkResults)
                    .then(() => checkWarframeIndex.isConsistent(item, details))
                    .then(checkResults)
                    .catch(error => {
                        console.log(error);
                    });
            })
            .catch(error => {
                createServerLog(error);
            });

        fullCheck.push(check);
        
        /**
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
        .catch(error => {
            console.log(error);
        });

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