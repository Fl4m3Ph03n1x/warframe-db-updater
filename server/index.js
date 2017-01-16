"use strict";

let jsonfile = require("jsonfile");
let ModScraper = require("./promisedScraper.js");

const WARFRAME_MARKET_DB_FILE = "external_data.json";

const SCRAPER_CONFIG_FILE = "./scraperConfig.json";
const OUTPUT_FOLDER = "./extracted_info";

jsonfile.readFile(SCRAPER_CONFIG_FILE, (err, result) => {
    if (err)
        console.log(err);

    let scrapy = new ModScraper(result);

    scrapy.getWarframeMods().then(result => {
        
        jsonfile.writeFile(OUTPUT_FOLDER + "/warframe_mods.json", result, { spaces: 4}, err => {
            if (err)
                console.log(err);
            else
                console.log("warframe_mods file complete");
        });
    });
    
    scrapy.getRifleMods().then(result => {
        
        jsonfile.writeFile(OUTPUT_FOLDER + "/rifle_mods.json", result, { spaces: 4}, err => {
            if (err)
                console.log(err);
            else
                console.log("rifle_mods file complete");
        });
    });
    
    scrapy.getShotgunMods().then(result => {
        
        jsonfile.writeFile(OUTPUT_FOLDER + "/shotgun_mods.json", result, { spaces: 4}, err => {
            if (err)
                console.log(err);
            else
                console.log("shotgun_mods file complete");
        });
    });
    
    scrapy.getPistolMods().then(result => {
        
        jsonfile.writeFile(OUTPUT_FOLDER + "/pistol_mods.json", result, { spaces: 4}, err => {
            if (err)
                console.log(err);
            else
                console.log("pistol_mods file complete");
        });
    });
    
    scrapy.getMeleeMods().then(result => {
        
        jsonfile.writeFile(OUTPUT_FOLDER + "/melee_mods.json", result, { spaces: 4}, err => {
            if (err)
                console.log(err);
            else
                console.log("melee_mods file complete");
        });
    });
});

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

let example = {
    "tradable": true,
    "_id": "54a74454e779892d5e515596",
    "icon": "icons/en/Serration.711b19665b2acbac445c68c9e8f8b550.png",
    "tags": [
        "mod",
        "rifle",
        "uncommon"
    ],
    "ru": {
        "icon": "icons/ru/Serration.47d9c768fde63632c64093367dc5f6ef.png",
        "drop": [{
            "name": "GrineerScorpion",
            "link": null
        }, {
            "name": "InfestedElectric Crawler",
            "link": null
        }, {
            "name": "InfestedNauseous Crawler",
            "link": null
        }, {
            "name": "Tier 2Defense Reward",
            "link": null
        }, {
            "name": "Tier 1/2/3Survival Reward",
            "link": null
        }, {
            "name": "Spy 2.0 Reward",
            "link": null
        }],
        "thumb": "icons/ru/thumbs/Serration.47d9c768fde63632c64093367dc5f6ef.128x128.png",
        "item_name": "Зазубрины",
        "wiki_link": "http://ru.warframe.wikia.com/wiki/%D0%97%D0%B0%D0%B7%D1%83%D0%B1%D1%80%D0%B8%D0%BD%D1%8B",
        "description": "<p>Зазубрины — необычный мод для основного оружия, который увеличивает базовый урон оружия.</p>"
    },
    "trading_tax": 4000,
    "icon_format": "port",
    "en": {
        "item_name": "Serration",
        "wiki_link": "http://warframe.wikia.com/wiki/Serration",
        "drop": [{
            "name": "GrineerScorpion",
            "link": null
        }, {
            "name": "InfestedElectric Crawler",
            "link": null
        }, {
            "name": "InfestedNauseous Crawler",
            "link": null
        }, {
            "name": "Tier 2Defense Reward",
            "link": null
        }, {
            "name": "Tier 1/2/3Survival Reward",
            "link": null
        }, {
            "name": "Spy 2.0 Reward",
            "link": null
        }],
        "description": "<p>The Serration mod increases the base damage of primary weapons (excluding shotguns) by 15% per rank, at a maximum of 165% at rank 10.</p>"
    },
    "thumb": "icons/en/thumbs/Serration.711b19665b2acbac445c68c9e8f8b550.128x128.png",
    "rarity": "uncommon",
    "mod_max_rank": 10,
    "url_name": "serration"
};