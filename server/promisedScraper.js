/**
 * @fileOverview Contains the scraper class, responsible for extracting
 * information from the warframe wikia mods page.
 * @author Pedro Miguel Pereira Serrano Martins
 * @version 2.0.0
 */

/*jslint node: true */
"use strict";

let cheerio = require('cheerio');
let request = require("request");
let Promise = require("promise");
let HTTPStatus = require("http-status");

const COLUMN_DESCRIPTION = "Description";
const COLUMN_POLARITY = "Polarity";
const PVP_ONLY_KEYWORD = "PvP";

/**
 * <p>This class is responsible for making requests and extracting information 
 * from the Warframe Wikia. All its methods are either query or process HTML 
 * information from that page. As all scrappers, when one day the wikia gets an 
 * uplift, so must this class.</p>
 * 
 * <p>This class makes usage of Promises for all the methods that make requests, 
 * so a I advise you to be confident with them.</p>
 * 
 * @see {@link https://www.toptal.com/javascript/javascript-promises}
 */
class ModScraper {

    /**
     * <p>Innitiazes a ModScraper instance with the given configurations. To </p>
     *
     * @constructor
     * @param    {Object}   config  The configuration object with all the links 
     *                              and config parameters for the scrapper. It 
     *                              is in the JSON file "scraperConfig.json".
     */
    constructor(config) {
        this.config = config;
        this.wikiaSource = this.config.sources.wikia;
        this.request = this.config.network.request;
    }

    getWarframeMods() {
        return this.getTableInfo(this.wikiaSource.link + this.wikiaSource.pages.warframe_mods);
    }
    
    getRifleMods() {
        return this.getTableInfo(this.wikiaSource.link + this.wikiaSource.pages.rifle_mods);
    }
    
    getShotgunMods() {
        return this.getTableInfo(this.wikiaSource.link + this.wikiaSource.pages.shotgun_mods);
    }
    
    getPistolMods() {
        return this.getTableInfo(this.wikiaSource.link + this.wikiaSource.pages.pistol_mods);
    }

    getMeleeMods() {
        return this.getTableInfo(this.wikiaSource.link + this.wikiaSource.pages.melee_mods);
    }
    
    getSentinelMods(){
        return this.getTableInfo(this.wikiaSource.link + this.wikiaSource.pages.sentinel_mods);
    }
    
    getKubrowMods(){
        return this.getTableInfo(this.wikiaSource.link + this.wikiaSource.pages.kubrow_mods);
    }
    
    getAuraMods(){
        return this.getTableInfo(this.wikiaSource.link + this.wikiaSource.pages.aura_mods);
    }
    
    getStanceMods(){
        return this.getTableInfo(this.wikiaSource.link + this.wikiaSource.pages.stance_mods);
    }

    /**
     */
    getTableInfo(url) {
        let self = this;

        return new Promise((fulfil, reject) => {

            //let url = self.wikiaSource.link + self.wikiaSource.pages.warframe_mods;

            self.requestHTML(url).then((htmlBody) => {
                self.$ = cheerio.load(htmlBody);

                //get table
                let table = self.$("table.listtable.sortable");

                //get rows from table               
                let trList = self.$(table).find("tr");

                //fill the headers and remove the 1st row as it was processed
                let headers = trList.first().children().text().trim().split("\n");
                headers = headers.map(str => str.trim());
                trList = trList.slice(1, trList.length);

                //aux variables for loop
                let result = [];
                let findCamelCase = new RegExp("([a-z]+[A-Z][a-z]+)");

                self.$(trList).each(function(index, elem) {
                    let currentTdList = self.$(this).children();
                    let item = {};
                    let line;
                    for (let tdIndex = 0; tdIndex < headers.length; tdIndex++) {

                        line = currentTdList.eq(tdIndex).text().trim();
                        
                        if (headers[tdIndex] == COLUMN_POLARITY) {
                            item[headers[tdIndex]] = currentTdList.eq(tdIndex).find("img").attr("alt").split(" ")[0];
                            
                            //Because the wikia has conflicting scripts, we must ensure we get the field we want.
                            item[headers[tdIndex] + "Link"] = currentTdList.eq(tdIndex).find("img").attr("data-src");
                            if(!(item[headers[tdIndex] + "Link"]))
                                item[headers[tdIndex] + "Link"] = currentTdList.eq(tdIndex).find("img").attr("src");
                        }
                        else if (headers[tdIndex] == COLUMN_DESCRIPTION) {
                            let words = line.split(" ");

                            for (let word of words) {
                                if (findCamelCase.test(word)) {
                                    let wordMinusFirst = word.slice(-word.length + 1);
                                    let newWord = word[0] + wordMinusFirst.replace(/([A-Z])/g, '. $1');
                                    line = line.replace(word, newWord);
                                }
                            }
                            
                            //http://stackoverflow.com/questions/6163169/replace-multiple-whitespaces-with-single-whitespace-in-javascript-string#
                            item[headers[tdIndex]] = line.replace(/\s+/g, " ") + ".";
                            
                            //check if it is PvP only.
                            if (item[headers[tdIndex]].includes(PVP_ONLY_KEYWORD))
                                item.PvPOnly = true;
                            else
                                item.PvPOnly = false;
                        }
                        else {
                            //if the header has associated links, we take them
                            if (currentTdList.eq(tdIndex).find("a").length)
                                item[headers[tdIndex] + "Link"] = currentTdList.eq(tdIndex).find("a").attr("href");
                            item[headers[tdIndex]] = line;
                        }
                    }
                    result.push(item);
                });
                fulfil(result);
            }).catch(error => {
                reject(error);
            });
        });
    }

    /**
     * <p>Makes a request to the given mod URL, downloads its information table and
     * returns an object with the information parsed.</p>
     *
     * @param   {string}    modURL  The URL of the wikia page containing the mod 
     *                              information to parse.
     * @return  {Promise}   A Promise containning a JSON object representing the 
     *                      mod.
     * @public
     */
    getModInformation(modURL) {

        let self = this;
        return new Promise(function(fulfil, reject) {
            self.requestHTML(modURL).then((htmlBody) => {

                self.$ = cheerio.load(htmlBody);

                let modInfo = {
                    modName: self.$(".pi-title > span:nth-child(1)").text().trim(),
                    modDescription: self.$("#mw-content-text > p:nth-child(2)").text().trim(),
                    modRarityLevel: self.$("div.pi-item:nth-child(3) > div:nth-child(2)").text().trim(),
                    modRarityTypeText: self.$("div.pi-item:nth-child(5) > div:nth-child(2)").text(),
                    traddingTax: self.$("div.pi-item:nth-child(4) > div:nth-child(2)").text().trim(),
                    modWikiaURL: modURL
                };

                modInfo.modRarityType = "Normal";
                if (modInfo.modRarityTypeText.includes("Nightmare"))
                    modInfo.modRarityType = "Nightmare";
                else if (modInfo.modRarityTypeText.includes("Orokin Derelict"))
                    modInfo.modRarityType = "Orokin Derelict";

                fulfil(modInfo);
            }).catch(error => {
                reject(error);
            });
        });
    }

    /**
     * <p>Makes a GET request to the given URL to download its HTML content and
     * returns a Promise of a result.</p>
     *
     * <p>On successfull completion of the request the promise returns the HTML
     * body of the HTML page. On fail, it returns a string with the error.</p>
     *
     * <p>This method does not make multiple retries, but if an error occurs it
     * differentiates between the error types with a best effort basis.</p>
     *
     * @todo Check if the page changed from last time before making the request.
     *
     * @param   {string}                    theURL  The URL of the page whose
     *                                              HTML content we want to
     *                                              download.
     * @return  {Promise}                   A Promise object with the body, or
     *                                      an exception.
     * @throws  PageUnreacheableException   Generic error used when the given
     *                                      page cannot be reached.
     * @throws  TimeoutReadException        Error generated when the given wikia
     *                                      page takes to long to read or write
     *                                      a response to us. Likely means the
     *                                      wikia server is overloaded with work.
     *                                      Genereted via Timeout.
     * @throws  TimeoutConnException        Error issued when our server cannot
     *                                      connect to the wikia server. Likely
     *                                      means that the wikia server is down,
     *                                      or that there is a connection issue
     *                                      on our side. Genereted via Timeout.
     * @public
     */
    requestHTML(url) {
        let self = this;
        return new Promise(function(fulfil, reject) {

            self.request.url = url;
            request(self.request,
                function(error, response, body) {

                    if (!error && response.statusCode == HTTPStatus.OK)
                        fulfil(body);
                    else if (error.code === 'ETIMEDOUT') {
                        if (error.connect)
                        //Tried to establish a connection to the wiki server and failed
                            reject("ConnectionTimeoutException");
                        else
                        //The wiki server is too slow responding (likely overload)
                            reject("ReadTimeoutException");
                    }
                    else
                    //general error ocurred
                        reject("PageUnreacheableException");
                });
        });
    }
}

module.exports = ModScraper;