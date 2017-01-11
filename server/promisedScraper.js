/**
 * @fileOverview Contains the scraper class, responsible for extracting
 * information from the warframe wikia mods page.
 * @author Pedro Miguel Pereira Serrano Martins
 * @version 1.0.0
 */

/*jslint node: true */
"use strict";

let cheerio = require('cheerio');
let request = require("request");
let Promise = require("promise");
let HTTPStatus = require("http-status");

/**
 * Base link of the Warframe Wikia. Used to complete relative links.
 *
 * @const
 * @readonly
 * @type    {string}
 * @default
 */
const WIKIA_PAGE_LINK = "http://warframe.wikia.com";

/**
 * Link to the wikia mods 2.0 page. This is the webapge initialy scraped with
 * the loadModsTable() function and the page containing a list of all mods, 
 * except Rivens.
 *
 * @const
 * @readonly
 * @type    {string}
 * @default
 */
const WIKIA_MODS_LINK = WIKIA_PAGE_LINK + "/wiki/Mods_2.0";

/**
 * Constant for the HTTP GET verb. Helps with clarity when reading the code.
 *
 * @const
 * @readonly
 * @type    {string}
 * @default
 */
const HTTP_GET = "GET";

/**
 * Time to wait before sending a timeout exception when making a request to the 
 * wikia servers.
 *
 * @const
 * @readonly
 * @type    {number}
 * @default
 */
const TIMEOUT_WAIT_TIME = 10000;

/**
 * A module that shouts hello!
 */
class ModScraper {

    /**
     * Innitiazes a ModScraper instance, but doesn't load it.
     *
     * Note that all of the methods from this instance can only be called once
     * it is fully loaded.
     *
     * To load an instance run the ModScraper.load() function.
     *
     * To check if an instace is loaded use the isLoaded flag.
     *
     * @constructor
     * @property    {string}    modsListTable       The HTML table from the wiki
     *                                              containing all the game's 
     *                                              mods. Does not include 
     *                                              Rivens.
     * @property    {string}    warframeModsTable   The HTML table containing 
     *                                              the warframe mods.
     * @property    {string}    rifleModsTable      The HTML table containing 
     *                                              the rifle mods.
     * @property    {string}    shotgunModsTable    The HTML table containing 
     *                                              the shotgun mods.
     * @property    {string}    pistolModsTable     The HTML table containing 
     *                                              the pistol mods.
     * @property    {string}    meleeModsTable      The HTML table containing 
     *                                              the melee mods.
     * @property    {string}    sentinelModsTable   The HTML table containing 
     *                                              the sentinel mods.
     * @property    {string}    kubrowModsTable     The HTML table containing 
     *                                              the kubrow mods.
     * @property    {string}    auraModsTable       The HTML table containing 
     *                                              the aura mods.
     * @property    {string}    stanceModsTable     The HTML table containing 
     *                                              the stance mods.
     * @property    {boolean}   isLoaded             Returns whether or not the 
     *                                              scraper has run the 
     *                                              loadModsTable() method and
     *                                              if it is ready to be used.
     * @property    {Object}    requestConfig       Object containing the 
     *                                              necessary information to 
     *                                              make the a request. 
     */
    constructor() {
        this.isLoaded = false;
        this.requestConfig = {
            method: HTTP_GET,
            gzip: true,
            timeout: TIMEOUT_WAIT_TIME
        };
    }

    /**
     * Downloads the HTML from the Wikia page, sets up all the mod tables. This
     * method is mandatory for the methods that required parsed information fom 
     * mods table and must be run before running them.
     * 
     * @return  {Promise}   A Promise that the table was correctly loaded. It 
     *                      only returns after eveything sucessfuly loaded from 
     *                      the website or throws an error. It is atomic. 
     * @see     {@link  requestHTML(url)}
     * @public
     */
    loadModsTable() {
        let self = this;

        return new Promise(function(fulfil, reject) {
            self.requestHTML(WIKIA_MODS_LINK).then((htmlBody) => {
                self.$ = cheerio.load(htmlBody);

                self.modsList = self.$("table.listtable.sortable");
                self.warframeModsTable = self.modsList.eq(0);
                self.rifleModsTable = self.modsList.eq(1);
                self.shotgunModsTable = self.modsList.eq(2);
                self.pistolModsTable = self.modsList.eq(3);
                self.meleeModsTable = self.modsList.eq(4);
                self.sentinelModsTable = self.modsList.eq(5);
                self.kubrowModsTable = self.modsList.eq(6);
                self.auraModsTable = self.modsList.eq(7);
                self.stanceModsTable = self.modsList.eq(8);

                self.isLoaded = true;

                fulfil();
            }).catch(error => {
                reject(error);
            });
        });
    }

    /**
     * Returns true if the main Mods table on WIKIA_MODS_LINK has been loaded
     * by the scraper, or false otherwise.
     * 
     * @return  {boolean}   true if the table has been loaded, false 
     *                      otherwise.
     * @see     {@link  WIKIA_MODS_LINK}
     * @public
     */
    isModsTableLoaded() {
        return this.isLoaded;
    }

    /**
     * Extracts a list of mod URLs from the given HTML table. Each URL links to
     * the wikia page of the mod it refers to.
     *
     * @param   {string}    aTable  The individual HTML table with the 
     *                              information needed.
     * @return  {Array}     An Array containing the all the URLs of all the mods
     *                      contained in the given table.
     * @throws  InstanceNotLoadedException
     * @see     {@link  loadModsTable()}
     * @public
     */
    getLinks(aTable) {

        if (!this.isLoaded)
            throw "InstanceNotLoadedException";

        let self = this;
        /*
         * 1. Get all <tr> elements
         * 2. Remove the first one (which is the header of the table)
         * 3. Get all the <td> child nodes from each <tr> element
         * 4. Process <td> elements 4 by 4 and get the link data in the 1st child
         */
        let trsList = self.$(aTable).find("tr");
        let columnsNumber = trsList.first().children().length;
        let tdsList = trsList.slice(1, trsList.length).children();
        let linkList = [];

        self.$(tdsList).each(function(index, elem) {
            if (index % columnsNumber == 0)
                linkList.push(WIKIA_PAGE_LINK + self.$(this).find("a").attr("href"));
        });

        return linkList;
    }

    /**
     * Makes a request to the given mod URL, downloads its information table and
     * returns an object with the information parsed.
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
     * Makes a GET request to the given URL to download its HTML content and
     * returns a Promise of a result
     *
     * On successfull completion of the request the promise returns the HTML
     * body of the HTML page. On fail, it returns a string with the error.
     *
     * This method does not make multiple retries, but if an error occurs it
     * differentiates between the error types with a best effort basis.
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

            self.requestConfig.url = url;
            request(self.requestConfig,
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