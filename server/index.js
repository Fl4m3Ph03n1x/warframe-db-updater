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
    RIFLE_MODS: "rifle_mods.json",
    SHOTGUN_MODS: "shotgun_mods.json",
    PISTOL_MODS: "pistol_mods.json",
    MELEE_MODS: "melee_mods.json",
    SENTINEL_MODS: "sentinel_mods.json",
    KUBROW_MODS: "kubrow_mods.json",
    AURA_MODS: "aura_mods.json",
    STANCE_MODS: "stance_mods.json"
};

let config = jsonfile.readFileSync(SCRAPER_CONFIG_FILE);
let scrapy = new ModScraper(config);

let writeOutput = function(filename, content){
    return write(OUTPUT_FOLDER + filename, content, TABS_FORMATTING);
};

// scrapy.getModInformation("http://warframe.wikia.com/wiki/Armored_Agility")
//     .then(result => console.log(result));

scrapy.getWarframeMods()
    .then(result => {
        let urlList = [];
        for(let mod of result){
             urlList.push(mod.NameLink);
        }
        
        return urlList;
    })
    .then(linksList => {
        let promisesArray = [];
        
        let wikiaURL = URL(scrapy.config.sources.wikia.link, true);
        
        for(let link of linksList){
            promisesArray.push(scrapy.getModInformation(wikiaURL.protocol + "//" + wikiaURL.hostname + link));
        }
        
        return new Promise.all(promisesArray);
    })
    .then(modsDetailedInfo => writeOutput("warframe_mods_links.json", modsDetailedInfo))
    .then(() => console.log("File completed."))
    .catch(error => console.error(error));

// scrapy.getRifleMods()
//     .then(result => writeOutput(FILE_NAME.RIFLE_MODS, result))
//     .then(console.log(FILE_NAME.RIFLE_MODS + " complete"))
//     .catch(error => console.error(error));

// scrapy.getShotgunMods()
//     .then(result => writeOutput(FILE_NAME.SHOTGUN_MODS, result))
//     .then(console.log(FILE_NAME.SHOTGUN_MODS + " complete"))
//     .catch(error => console.error(error));
    
// scrapy.getPistolMods()
//     .then(result => writeOutput(FILE_NAME.PISTOL_MODS, result))
//     .then(console.log(FILE_NAME.PISTOL_MODS + " complete"))
//     .catch(error => console.error(error));

// scrapy.getMeleeMods()
//     .then(result => writeOutput(FILE_NAME.MELEE_MODS, result))
//     .then(console.log(FILE_NAME.MELEE_MODS + " complete"))
//     .catch(error => console.error(error));

// scrapy.getSentinelMods()
//     .then(result => writeOutput(FILE_NAME.SENTINEL_MODS, result))
//     .then(console.log(FILE_NAME.SENTINEL_MODS + " complete"))
//     .catch(error => console.error(error));

// scrapy.getKubrowMods()
//     .then(result => writeOutput(FILE_NAME.KUBROW_MODS, result))
//     .then(console.log(FILE_NAME.KUBROW_MODS + " complete"))
//     .catch(error => console.error(error));

// scrapy.getAuraMods()
//     .then(result => writeOutput(FILE_NAME.AURA_MODS, result))
//     .then(console.log(FILE_NAME.AURA_MODS + " complete"))
//     .catch(error => console.error(error));

// scrapy.getStanceMods()
//     .then(result => writeOutput(FILE_NAME.STANCE_MODS, result))
//     .then(console.log(FILE_NAME.STANCE_MODS + " complete"))
//     .catch(error => console.error(error));