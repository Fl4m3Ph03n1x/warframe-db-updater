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

