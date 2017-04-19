"use strict";

//Public libs
const URL = require('url-parse');
const request = require("request");
const Promise = require("promise");

//Personal libs
const ModScraper = require("./promisedScraper.js");
const sparse = require("./utils/sparse.js");
const checkWarframeData = require("./checkers/warframeData/warframeDataChecker.js");

//Config files
const CONFIG_FILES = {
    SCRAPPER: "./configs/scraperConfig.json",
    SERVER: "./configs/serverConfig.json"
};

//Setup 
const errorParams = require(CONFIG_FILES.SERVER).errorHandling;
const waitParams = require(CONFIG_FILES.SERVER).minIntervalWaits;
const scrapperCfg = require(CONFIG_FILES.SCRAPPER);
const scrapy = new ModScraper(scrapperCfg);

//Neverending story
const cycle = function() {
    console.log("calling");

    scrapy.getWarframeMods()
        .then(modsTable => {
            return checkWarframeData(modsTable, {
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
};

cycle();
// setInterval(cycle, waitParams.cycles);//from seconds to miliseconds
