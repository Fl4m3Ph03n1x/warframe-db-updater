"use strict";

let jsonfile = require("jsonfile");
let ModScraper = require("./promisedScraper.js");

const WIKIA_MODS_LINK = "http://warframe.wikia.com/wiki/Mods_2.0";
const MODS_LIST_FILE_NAME = "mods_list.json";

let scrapy = new ModScraper();


let sucessFn = function(){
     let warframe_mods_links = scrapy.getLinks(scrapy.warframeModsTable);
     let armored_agility_link= warframe_mods_links[0];
     
     
     scrapy.getModInformation(armored_agility_link).then((modInfo) => {console.log(modInfo)}).catch(failFn);
     
};

let failFn = function(error){
     console.log("Logging error: " + error);
};

scrapy.loadModsTable().then(sucessFn).catch(failFn);


// scrapy.getLinks(scrapy.warframeModsTable);

// scrapy.getModInformationTest("http://warframe.wikia.com/wiki/Armored_Agility")
//      .then(result => {
//           console.log(result);
//      })
//      .catch(error => {
//           console.log("error: " + error);
//      });


// "use strict";

// let jsonfile = require("jsonfile");
// // let ModScraper = require("./scraper.js");
// let ModScraper = require("./promisedScraper.js");

// const WIKIA_MODS_LINK = "http://warframe.wikia.com/wiki/Mods_2.0";
// const MODS_LIST_FILE_NAME = "mods_list.json";

// let scrapy = new ModScraper();

// scrapy.load(
//      () => {
//           let warfrafe_mods = scrapy.getLinks(scrapy.warframeModsTable);
//           // let mods_list = {
//           //      warfrafe_mods : scrapy.getLinks(scrapy.warframeModsTable),
//           //      rifle_mods: scrapy.getLinks(scrapy.rifleModsTable),
//           //      shotgun_mods: scrapy.getLinks(scrapy.shotgunModsTable),
//           //      pistol_mods: scrapy.getLinks(scrapy.pistolModsTable),
//           //      melee_mods: scrapy.getLinks(scrapy.meleeModsTable),
//           //      sentinel_mods: scrapy.getLinks(scrapy.sentinelModsTable),
//           //      kubrow_mods: scrapy.getLinks(scrapy.kubrowModsTable),
//           //      aura_mods: scrapy.getLinks(scrapy.auraModsTable),
//           //      stance_mods: scrapy.getLinks(scrapy.stanceModsTable)
//           // };

//           // for(let link in warfrafe_mods) {
//           //      console.log(scrapy.getModInformation(link))
//           // }

//           // jsonfile.writeFile(MODS_LIST_FILE_NAME, mods_list, {spaces: 2}, err => {
//           //      if (err)
//           //           console.log(err);


//           // });
//           // console.log(scrapy.getModInformation(warfrafe_mods[0]));
//      }
// );

// scrapy.getModInformationTest("http://warframe.wikia.com/wiki/Armored_Agility")
//      .then(result => {
//           console.log(result);
//      })
//      .catch(error => {
//           console.log("error: " + error);
//      });
