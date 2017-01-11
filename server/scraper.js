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
let _ = require("underscore");
let Promise = require("promise");
let HTTPStatus = require("http-status");

/**
 * Base link of the Warframe Wikia. Used to complete relative links.
 * 
 * @const
 * @type    {string}
 */
const WIKIA_PAGE_LINK = "http://warframe.wikia.com";

/**
 * Link to the wikia mods 2.0 page. This is the webapge initialy scraped with 
 * the `load()` function.
 * 
 * @const
 * @type    {string}
 */
const WIKIA_MODS_LINK = WIKIA_PAGE_LINK + "/wiki/Mods_2.0";

const MAX_REQUEST_TRIES = 4;
const DEFAULT_WAIT = 60000;
const TIMEOUT_READ_WAIT = 120000;
const TIMEOUT_CONN_WAIT = 900000;
const TIMEOUT_WAIT_TIME = 10000;


/**
 * A module that shouts hello!
 * @module ModScraper
 */
module.exports = class ModScraper {


    /**
     * Innitiazes a ModScraper instance, but doesn't load it. 
     * 
     * Note that all of the methods from this instance can only be called once
     * it is fully loaded. 
     * 
     * To load an instance run the `ModScraper.load()` function.
     * 
     * To check if an instace is loaded use the `isLoaded` flag.
     * 
     * @constructor
     * @property    {string}    htmlBody            description
     * @property    {string}    modsList            description
     * @property    {string}    warframeModsTable   description
     * @property    {string}    rifleModsTable      description
     * @property    {string}    shotgunModsTable    description
     * @property    {string}    pistolModsTable     description
     * @property    {string}    meleeModsTable      description
     * @property    {string}    sentinelModsTable   description
     * @property    {string}    kubrowModsTable     description
     * @property    {string}    auraModsTable       description
     * @property    {string}    stanceModsTable     description
     * @param       {function}  [theBody]           description
     * @param       {Object}    [...params]         description    
     * @public
     */
    constructor() {
        this.isLoaded = false;
        this.requestConfig = {
            method: "GET",
            gzip: true,
            timeout: TIMEOUT_WAIT_TIME
        };
    }

    /**
     * Downloads the HTML from the Wikia page, setps up all the mod table 
     * variables and runs the given function with the given arguments.
     * 
     * @public
     */
    load() {

        let onResponseFn = function(htmlBody, obj, onLoadArgs) {
            obj.$ = cheerio.load(htmlBody);

            obj.modsList = obj.$("table.listtable.sortable");
            obj.warframeModsTable = obj.modsList.eq(0);
            obj.rifleModsTable = obj.modsList.eq(1);
            obj.shotgunModsTable = obj.modsList.eq(2);
            obj.pistolModsTable = obj.modsList.eq(3);
            obj.meleeModsTable = obj.modsList.eq(4);
            obj.sentinelModsTable = obj.modsList.eq(5);
            obj.kubrowModsTable = obj.modsList.eq(6);
            obj.auraModsTable = obj.modsList.eq(7);
            obj.stanceModsTable = obj.modsList.eq(8);

            obj.isLoaded = true;

            /*!
             * Executing functions with a dynamic number of parameters: 
             * http://stackoverflow.com/questions/676721/calling-dynamic-function-with-dynamic-parameters-in-javascript
             */
            if (onLoadArgs.length !== 0)
                onLoadArgs[0].apply(this, Array.prototype.slice.call(onLoadArgs, 1));
        };

        this.requestHtml(WIKIA_MODS_LINK, onResponseFn, arguments);
    }

    /**
     * Extracts a list of mod URLs from the given HTML table. Each URL links to 
     * the wikia page of the mod it refers to. 
     * 
     * @param   {string}    aTable  The individual HTML table with the information needed. 
     * @return  {Array}     An Array containing the all the URLs of all the mods contained in the given table.
     * @throws  InstanceNotLoadedException
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
     * If the first request fails, it will attemp five more times with different 
     * delays depending on the situation.
     * 
     * After exausting all tries, if nothing works, it throws an exception with 
     * the problem found.
     * 
     * @param   {string}    modURL  The URL of the wikia page containing the mod information to parse. 
     * @return  {Object}    A JSON object representing the mod. 
     * @throws  InstanceNotLoadedException
     * @throws PageUnreacheableException
     * @public 
     */
    getModInformation(modURL) {
        if (!this.isLoaded)
            throw "InstanceNotLoadedException";

        let onResponseFn = function(htmlBody, obj, onLoadArgs) {
            obj.$ = cheerio.load(htmlBody);

            let modName = obj.$(".pi-title > span:nth-child(1)").text().trim();
            let modDescription = obj.$("#mw-content-text > p:nth-child(2)").text().trim();
            let modRarityLevel = obj.$("div.pi-item:nth-child(3) > div:nth-child(2)").text().trim();

            let modRarityTypeText = obj.$("div.pi-item:nth-child(5) > div:nth-child(2)").text();
            let modRarityType = "Normal";
            if (_.contains(modRarityTypeText, "Nightmare"))
                modRarityType = "Nightmare";
            else if (_.contains(modRarityTypeText, "Orokin Derelict"))
                modRarityType = "Orokin Derelict";

            let traddingTax = obj.$("div.pi-item:nth-child(4) > div:nth-child(2)").text().trim();
            let modWikiaURL = modURL;
            let featuredBuilds = ["http://www.google.com", "http://www.sapo.pt"];

            // console.log(modName);
            // console.log(modDescription);
            // console.log(modRarityLevel);
            // console.log(modRarityType);
            // console.log(traddingTax);
            // console.log(modWikiaURL);
            // console.log(featuredBuilds);

            return "Hello World";
        };

        // this.requestHtml(modURL, onResponseFn, []);
    }

    requestHTMLTest(){
        let self = this;
        return new Promise(function(fulfil, reject) {

            if (!self.isLoaded)
                reject("InstanceNotLoadedException");

            this.requestConfig.url = modURL;
            request(this.requestConfig,
                function(error, response, body) {

                    if (!error && response.statusCode == HTTPStatus.OK) {

                        self.$ = cheerio.load(body);

                        let modName = self.$(".pi-title > span:nth-child(1)").text().trim();
                        // let modDescription = obj.$("#mw-content-text > p:nth-child(2)").text().trim();
                        // let modRarityLevel = obj.$("div.pi-item:nth-child(3) > div:nth-child(2)").text().trim();

                        // let modRarityTypeText = obj.$("div.pi-item:nth-child(5) > div:nth-child(2)").text();
                        // let modRarityType = "Normal";
                        // if (_.contains(modRarityTypeText, "Nightmare"))
                        //     modRarityType = "Nightmare";
                        // else if (_.contains(modRarityTypeText, "Orokin Derelict"))
                        //     modRarityType = "Orokin Derelict";

                        // let traddingTax = obj.$("div.pi-item:nth-child(4) > div:nth-child(2)").text().trim();
                        // let modWikiaURL = modURL;
                        // let featuredBuilds = ["http://www.google.com", "http://www.sapo.pt"];


                        fulfil(modName);
                    }
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
    
    getModInformationTest(modURL) {
        
        let self = this;
        return new Promise(function(fulfil, reject) {

            if (!self.isLoaded)
                reject("InstanceNotLoadedException");

            this.requestConfig.url = modURL;
            request(this.requestConfig,
                function(error, response, body) {

                    if (!error && response.statusCode == HTTPStatus.OK) {

                        self.$ = cheerio.load(body);

                        let modName = self.$(".pi-title > span:nth-child(1)").text().trim();
                        // let modDescription = obj.$("#mw-content-text > p:nth-child(2)").text().trim();
                        // let modRarityLevel = obj.$("div.pi-item:nth-child(3) > div:nth-child(2)").text().trim();

                        // let modRarityTypeText = obj.$("div.pi-item:nth-child(5) > div:nth-child(2)").text();
                        // let modRarityType = "Normal";
                        // if (_.contains(modRarityTypeText, "Nightmare"))
                        //     modRarityType = "Nightmare";
                        // else if (_.contains(modRarityTypeText, "Orokin Derelict"))
                        //     modRarityType = "Orokin Derelict";

                        // let traddingTax = obj.$("div.pi-item:nth-child(4) > div:nth-child(2)").text().trim();
                        // let modWikiaURL = modURL;
                        // let featuredBuilds = ["http://www.google.com", "http://www.sapo.pt"];


                        fulfil(modName);
                    }
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


    /**
     * Makes a GET request to the given URL to download its HTML content and on 
     * successfull completion of the request it executes the given function with 
     * the given parameters. 
     * 
     * If the first request fails, it will attemp five more times with different 
     * delays depending on the situation.
     * 
     * After exausting all tries, if nothing works, it throws an exception with 
     * the problem found.
     * 
     * @todo Check if the page changed from last time before making the request  
     * 
     * @param   {string}                    theURL              The URL of the page whose HTML content we want to download.
     * @param   {function}                  onResponseFn        The function to be executed once the request successfully completes.
     * @param   {Array}                     onResponseParams    The arguments of the onResponseFn.
     * @param   {number}                    [currentTry]        The current amount of tries. Used to keep track of how many times we made the request to the server in case of error.
     * @param   {ModScraper}                [self]              Reference to the context object used to make the subsequent calls if the first request fails.
     * @throws  PageUnreacheableException   Generic error used when the given page cannot be reached.
     * @throws  TimeoutReadException        Error generated when the given wikia page takes to long to read or write a response to us. Likely means the wikia server is overloaded wit work. Genereted via Timeout.
     * @throws  TimeoutConnException        Error issued when our server can't connect to the wikia server. Likely means that the wikia server is down, or that there is a connection issue on our side. Genereted via Timeout.
     * @private
     */
    requestHtml(theURL, onResponseFn, onResponseParams, currentTry = 0, self = this) {
        let retryFn = self.requestHtml;

        request({
            method: "GET",
            url: theURL,
            gzip: true,
            timeout: TIMEOUT_WAIT_TIME
        }, function(error, response, body) {

            if (!error && response.statusCode == 200) {
                onResponseFn(body, self, onResponseParams);
            }
            //wikia server is either overloaded or down
            else if (error.code === 'ETIMEDOUT') {

                //connection timeout, server is likely down
                if (error.connect) {
                    if (currentTry > MAX_REQUEST_TRIES)
                        throw "TimeoutConnException";

                    _.delay(retryFn, TIMEOUT_CONN_WAIT, theURL, onResponseFn, onResponseParams, ++currentTry, self);
                }
                //read timeout, connection was successfull, but server is overloaded with requests
                else {
                    if (currentTry > MAX_REQUEST_TRIES)
                        throw "TimeoutReadException";

                    _.delay(retryFn, TIMEOUT_READ_WAIT, theURL, onResponseFn, onResponseParams, ++currentTry, self);
                }
            }
            //general error ocurred
            else {
                if (currentTry > MAX_REQUEST_TRIES)
                    throw "PageUnreacheableException";

                _.delay(retryFn, DEFAULT_WAIT, theURL, onResponseFn, onResponseParams, ++currentTry, self);
            }
        });
    }
};
