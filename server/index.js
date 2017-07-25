"use strict";

//Public libs
const URL = require('url-parse');
const request = require("request");
const Promise = require("promise");

//Personal libs
const ModScraper = require("./promisedScraper.js");
const sparse = require("./utils/sparse.js");
const warframeData = require("./checkers/warframe/warframeData.js");

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

    const warframeOpts = {
        wikiaURL: new URL(scrapperCfg.sources.wikia.link).origin,
        requestFun: sparse(Promise.denodeify(request), waitParams.requests),
        rarities: ["Common", "Uncommon", "Rare", "Legendary", "Riven"],
        polarities: ["Vazarin", "Madurai", "Naramon", "Zenurik", "Penjaga", "Unairu"],
        subcategories: ["None", "Acolyte", "Corrupted", "Nightmare"],
        scrapy,
        errorParams
    };

    /*
     *  Check HTT Cache headers
     *  https://files3.lynda.com/secure/courses/577372/VBR_MP4h264_main_HD720/577372_05_04_XR15_Caching.mp4?9C3fE9rTcbN-8NJXp7A9YzUxxcYAFx2UMi7XOQ7A88WYzxzQyOcnss4CNauynlQHtJyrln2vImbJ8-x-S6wc0eSglCj-orPN9DfLvXsp7DT2XR-jojUpHFwI95d3IU-3KR2S3bfj72oOE0Vvc141YS65kl-npLk_zQcZRvS9xVrXfGc4AlmkTc6O0afJm8w&c3.ri=3773329830645070391
     */
    scrapy.getWarframeMods()
        .then(modsTable => warframeData(modsTable, warframeOpts))
        .then(() => console.log("checked Warframe data"))
        .catch(console.log);
};

cycle();
// setInterval(cycle, waitParams.cycles);//from seconds to miliseconds
