"use strict";

let jsonfile = require("jsonfile");
let ModScraper = require("./promisedScraper.js");
let Promise = require("promise");
let write = Promise.denodeify(jsonfile.writeFile);

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

scrapy.getWarframeMods()
    .then(result => writeOutput(FILE_NAME.WARFRAME_MODS, result))
    .then(console.log(FILE_NAME.WARFRAME_MODS + " complete"))
    .catch(error => console.error(error));

scrapy.getRifleMods()
    .then(result => writeOutput(FILE_NAME.RIFLE_MODS, result))
    .then(console.log(FILE_NAME.RIFLE_MODS + " complete"))
    .catch(error => console.error(error));

scrapy.getShotgunMods()
    .then(result => writeOutput(FILE_NAME.SHOTGUN_MODS, result))
    .then(console.log(FILE_NAME.SHOTGUN_MODS + " complete"))
    .catch(error => console.error(error));
    
scrapy.getPistolMods()
    .then(result => writeOutput(FILE_NAME.PISTOL_MODS, result))
    .then(console.log(FILE_NAME.PISTOL_MODS + " complete"))
    .catch(error => console.error(error));

scrapy.getMeleeMods()
    .then(result => writeOutput(FILE_NAME.MELEE_MODS, result))
    .then(console.log(FILE_NAME.MELEE_MODS + " complete"))
    .catch(error => console.error(error));

scrapy.getSentinelMods()
    .then(result => writeOutput(FILE_NAME.SENTINEL_MODS, result))
    .then(console.log(FILE_NAME.SENTINEL_MODS + " complete"))
    .catch(error => console.error(error));

scrapy.getKubrowMods()
    .then(result => writeOutput(FILE_NAME.KUBROW_MODS, result))
    .then(console.log(FILE_NAME.KUBROW_MODS + " complete"))
    .catch(error => console.error(error));

scrapy.getAuraMods()
    .then(result => writeOutput(FILE_NAME.AURA_MODS, result))
    .then(console.log(FILE_NAME.AURA_MODS + " complete"))
    .catch(error => console.error(error));

scrapy.getStanceMods()
    .then(result => writeOutput(FILE_NAME.STANCE_MODS, result))
    .then(console.log(FILE_NAME.STANCE_MODS + " complete"))
    .catch(error => console.error(error));

/*
 * tradable: ok
 * _id: auto
 * icon: from wiki
 * tags: ok
 * ru: not needed
 * trading_tax: ok
 * en: ok
 * icon_format: auto
 * thumb: auto
 * rarity: ok,
 * mod_max_rank: ok,
 * url_name: auto
 */

// let example = {
//     "tradable": true,
//     "_id": "54a74454e779892d5e515596",
//     "icon": "icons/en/Serration.711b19665b2acbac445c68c9e8f8b550.png",
//     "tags": [
//         "mod",
//         "rifle",
//         "uncommon"
//     ],
//     "ru": {
//         "icon": "icons/ru/Serration.47d9c768fde63632c64093367dc5f6ef.png",
//         "drop": [{
//             "name": "GrineerScorpion",
//             "link": null
//         }, {
//             "name": "InfestedElectric Crawler",
//             "link": null
//         }, {
//             "name": "InfestedNauseous Crawler",
//             "link": null
//         }, {
//             "name": "Tier 2Defense Reward",
//             "link": null
//         }, {
//             "name": "Tier 1/2/3Survival Reward",
//             "link": null
//         }, {
//             "name": "Spy 2.0 Reward",
//             "link": null
//         }],
//         "thumb": "icons/ru/thumbs/Serration.47d9c768fde63632c64093367dc5f6ef.128x128.png",
//         "item_name": "Зазубрины",
//         "wiki_link": "http://ru.warframe.wikia.com/wiki/%D0%97%D0%B0%D0%B7%D1%83%D0%B1%D1%80%D0%B8%D0%BD%D1%8B",
//         "description": "<p>Зазубрины — необычный мод для основного оружия, который увеличивает базовый урон оружия.</p>"
//     },
//     "trading_tax": 4000,
//     "icon_format": "port",
//     "en": {
//         "item_name": "Serration",
//         "wiki_link": "http://warframe.wikia.com/wiki/Serration",
//         "drop": [{
//             "name": "GrineerScorpion",
//             "link": null
//         }, {
//             "name": "InfestedElectric Crawler",
//             "link": null
//         }, {
//             "name": "InfestedNauseous Crawler",
//             "link": null
//         }, {
//             "name": "Tier 2Defense Reward",
//             "link": null
//         }, {
//             "name": "Tier 1/2/3Survival Reward",
//             "link": null
//         }, {
//             "name": "Spy 2.0 Reward",
//             "link": null
//         }],
//         "description": "<p>The Serration mod increases the base damage of primary weapons (excluding shotguns) by 15% per rank, at a maximum of 165% at rank 10.</p>"
//     },
//     "thumb": "icons/en/thumbs/Serration.711b19665b2acbac445c68c9e8f8b550.128x128.png",
//     "rarity": "uncommon",
//     "mod_max_rank": 10,
//     "url_name": "serration"
// };