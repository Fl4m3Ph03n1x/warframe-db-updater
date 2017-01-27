"use strict";

let jsonfile = require("jsonfile");
let ModScraper = require("./promisedScraper.js");
let Promise = require("promise");
let write = Promise.denodeify(jsonfile.writeFile);
let URL = require('url-parse');

const WARFRAME_MARKET_DB_FILE = "external_data.json";
const SCRAPER_CONFIG_FILE = "./scraperConfig.json";
const OUTPUT_FOLDER = "./extracted_info/";
const TABS_FORMATTING = {
    spaces: 4
};

const FILE_NAME = {
    WARFRAME_MODS: "warframe_mods.json",
    WARFRAME_MODS_INFO: "warframe_mods_info.json",
    RIFLE_MODS: "rifle_mods.json",
    RIFLE_MODS_INFO: "rifle_mods_info.json",
    SHOTGUN_MODS: "shotgun_mods.json",
    SHOTGUN_MODS_INFO: "shotgun_mods_info.json",
    PISTOL_MODS: "pistol_mods.json",
    PISTOL_MODS_INFO: "pistol_mods_info.json",
    MELEE_MODS: "melee_mods.json",
    MELEE_MODS_INFO: "melee_mods_info.json",
    SENTINEL_MODS: "sentinel_mods.json",
    SENTINEL_MODS_INFO: "sentinel_mods_info.json",
    KUBROW_MODS: "kubrow_mods.json",
    KUBROW_MODS_INFO: "kubrow_mods_info.json",
    AURA_MODS: "aura_mods.json",
    AURA_MODS_INFO: "aura_mods_info.json",
    STANCE_MODS: "stance_mods.json",
    STANCE_MODS_INFO: "stance_mods_info.json"
};

let config = jsonfile.readFileSync(SCRAPER_CONFIG_FILE);
let scrapy = new ModScraper(config);

let writeOutput = function(filename, content) {
    return write(OUTPUT_FOLDER + filename, content, TABS_FORMATTING);
};

let getURLsList = function(modsList) {
    let urlList = [];

    for (let mod of modsList)
        urlList.push(mod.NameLink);

    return urlList;
};

let makeBatchRequest = function(linksList) {
    let promisesArray = [];

    let wikiaURL = URL(scrapy.config.sources.wikia.link, true);

    for (let link of linksList) {
        promisesArray.push(scrapy.getModInformation(wikiaURL.protocol + "//" + wikiaURL.hostname + link));
    }

    return new Promise.all(promisesArray);
};


//Get General information from mod tables
scrapy.getWarframeMods()
    .then(result => writeOutput(FILE_NAME.WARFRAME_MODS, result))
    .then(() => console.log(FILE_NAME.WARFRAME_MODS + " complete"))
    .catch(console.log);

scrapy.getRifleMods()
    .then(result => writeOutput(FILE_NAME.RIFLE_MODS, result))
    .then(() => console.log(FILE_NAME.RIFLE_MODS + " complete"))
    .catch(console.log);

scrapy.getShotgunMods()
    .then(result => writeOutput(FILE_NAME.SHOTGUN_MODS, result))
    .then(() => console.log(FILE_NAME.SHOTGUN_MODS + " complete"))
    .catch(console.log);

scrapy.getPistolMods()
    .then(result => writeOutput(FILE_NAME.PISTOL_MODS, result))
    .then(() => console.log(FILE_NAME.PISTOL_MODS + " complete"))
    .catch(console.log);

scrapy.getMeleeMods()
    .then(result => writeOutput(FILE_NAME.MELEE_MODS, result))
    .then(() => console.log(FILE_NAME.MELEE_MODS + " complete"))
    .catch(console.log);

scrapy.getSentinelMods()
    .then(result => writeOutput(FILE_NAME.SENTINEL_MODS, result))
    .then(() => console.log(FILE_NAME.SENTINEL_MODS + " complete"))
    .catch(console.log);

scrapy.getKubrowMods()
    .then(result => writeOutput(FILE_NAME.KUBROW_MODS, result))
    .then(() => console.log(FILE_NAME.KUBROW_MODS + " complete"))
    .catch(console.log);

scrapy.getAuraMods()
    .then(result => writeOutput(FILE_NAME.AURA_MODS, result))
    .then(() => console.log(FILE_NAME.AURA_MODS + " complete"))
    .catch(console.log);

scrapy.getStanceMods()
    .then(result => writeOutput(FILE_NAME.STANCE_MODS, result))
    .then(() => console.log(FILE_NAME.STANCE_MODS + " complete"))
    .catch(console.log);

// get detailed information for each mod
scrapy.getWarframeMods()
    .then(getURLsList)
    .then(makeBatchRequest)
    .then(modsDetailedInfo => writeOutput(FILE_NAME.WARFRAME_MODS_INFO, modsDetailedInfo))
    .then(() => console.log(FILE_NAME.WARFRAME_MODS_INFO + " completed."))
    .catch(console.log);

scrapy.getRifleMods()
    .then(getURLsList)
    .then(makeBatchRequest)
    .then(modsDetailedInfo => writeOutput(FILE_NAME.RIFLE_MODS_INFO, modsDetailedInfo))
    .then(() => console.log(FILE_NAME.RIFLE_MODS_INFO + " completed."))
    .catch(console.log);

scrapy.getShotgunMods()
    .then(getURLsList)
    .then(makeBatchRequest)
    .then(modsDetailedInfo => writeOutput(FILE_NAME.SHOTGUN_MODS_INFO, modsDetailedInfo))
    .then(() => console.log(FILE_NAME.SHOTGUN_MODS_INFO + " completed."))
    .catch(console.log);

scrapy.getPistolMods()
    .then(getURLsList)
    .then(makeBatchRequest)
    .then(modsDetailedInfo => writeOutput(FILE_NAME.PISTOL_MODS_INFO, modsDetailedInfo))
    .then(() => console.log(FILE_NAME.PISTOL_MODS_INFO + " completed."))
    .catch(console.log);

scrapy.getMeleeMods()
    .then(getURLsList)
    .then(makeBatchRequest)
    .then(modsDetailedInfo => writeOutput(FILE_NAME.MELEE_MODS_INFO, modsDetailedInfo))
    .then(() => console.log(FILE_NAME.MELEE_MODS_INFO + " completed."))
    .catch(console.log);

scrapy.getSentinelMods()
    .then(getURLsList)
    .then(makeBatchRequest)
    .then(modsDetailedInfo => writeOutput(FILE_NAME.SENTINEL_MODS_INFO, modsDetailedInfo))
    .then(() => console.log(FILE_NAME.SENTINEL_MODS_INFO + " completed."))
    .catch(console.log);

scrapy.getKubrowMods()
    .then(getURLsList)
    .then(makeBatchRequest)
    .then(modsDetailedInfo => writeOutput(FILE_NAME.KUBROW_MODS_INFO, modsDetailedInfo))
    .then(() => console.log(FILE_NAME.KUBROW_MODS_INFO + " completed."))
    .catch(console.log);

scrapy.getAuraMods()
    .then(getURLsList)
    .then(makeBatchRequest)
    .then(modsDetailedInfo => writeOutput(FILE_NAME.AURA_MODS_INFO, modsDetailedInfo))
    .then(() => console.log(FILE_NAME.AURA_MODS_INFO + " completed."))
    .catch(console.log);

scrapy.getStanceMods()
    .then(getURLsList)
    .then(makeBatchRequest)
    .then(modsDetailedInfo => writeOutput(FILE_NAME.STANCE_MODS_INFO, modsDetailedInfo))
    .then(() => console.log(FILE_NAME.STANCE_MODS_INFO + " completed."))
    .catch(console.log);
