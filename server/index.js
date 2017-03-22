"use strict";

let jsonfile = require("jsonfile");
let URL = require('url-parse');
let request = require("request");
let Promise = require("promise");

let ModScraper = require("./promisedScraper.js");
let sparse = require("./utils/sparse.js");
const checkWarframeData = require("./checkers/warframeData/warframeDataChecker.js");

const CONFIG_FILES = {
    SCRAPPER: "./configs/scraperConfig.json",
    SERVER: "./configs/serverConfig.json"
};

let errorParams = jsonfile.readFileSync(CONFIG_FILES.SERVER).errorHandling;
let waitParams = jsonfile.readFileSync(CONFIG_FILES.SERVER).minIntervalWaits;
let scrapperCfg = jsonfile.readFileSync(CONFIG_FILES.SCRAPPER);
let scrapy = new ModScraper(scrapperCfg);

let cycle = function() {
    console.log("calling");
    
    scrapy.getWarframeMods()
        .then(modsTable => {
            return checkWarframeData(modsTable, 
            {
                wikiaURL: new URL(scrapperCfg.sources.wikia.link).origin,
                requestFun: sparse(Promise.denodeify(request), waitParams.requests),
                rarities: ["Common", "Uncommon", "Rare", "Legendary", "Riven"],
                polarities: ["Vazarin", "Madurai", "Naramon", "Zenurik", "Penjaga", "Unairu"],
                subcategories: ["None", "Acolyte", "Corrupted", "Nightmare"],
                scrapy,
                errorParams
            });
        })
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