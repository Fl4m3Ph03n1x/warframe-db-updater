/**
 * @fileOverview Contains the scraper class, responsible for extracting
 * information from the warframe wikia mods pages.
 * @author Pedro Miguel Pereira Serrano Martins
 * @version 2.3.1
 */

/*jslint node: true */
"use strict";

let cheerio = require('cheerio');
let request = require("request");
let Promise = require("promise");
let HTTPStatus = require("http-status");

/**
 *  <p>Name of the Description column in the mods table.</p>
 *  @const      {string}
 *  @readonly
 */
const COLUMN_DESCRIPTION = "Description";

/**
 *  <p>Name of the Polarity column in the mods table.</p>
 *  @const      {string}
 *  @readonly
 */
const COLUMN_POLARITY = "Polarity";

/**
 *  <p>Keyword dictionary for specific words that the scrapper tests against.</p>
 * 
 *  <p>Usually it is a better idea to check for logic patterns or HTML tags, but
 *  when those are non existent I use certain keywords as a last resort.</p>
 *
 *  @const      {Object}
 *  @readonly
 */
const KEYWORDS = {
    PVP_ONLY: "PvP",
    TRANSMUTABLE: "Transmutable",
    NA: "N/A"
};

/**
 * <p>This class is responsible for making requests and extracting information 
 * from the Warframe Wikia. All its methods either query or process HTML 
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
     * <p>Innitiazes a ModScraper instance with the given configurations.</p>
     *
     * @constructor
     * @param    {Object}   config  The configuration object with all the links 
     *                              and config parameters for the scrapper. It 
     *                              is in the JSON file "scraperConfig.json".
     * @public
     */
    constructor(config) {
        this.config = config;
        this.wikiaSource = this.config.sources.wikia;
        this.request = this.config.network.request;
    }

    /**
     * <p>Queries the Warframe Mods table containing all the Warframe mods and
     * information relative to them.</p>
     * 
     * @return {Promise} A Promise with a Json object containing the data.
     * @public
     */
    getWarframeMods() {
        return this.getTableInfo(this.wikiaSource.link + this.wikiaSource.pages.warframe_mods);
    }

    /**
     * <p>Queries the Rifle Mods table containing all the Rifle mods and
     * information relative to them.</p>
     * 
     * @return {Promise} A Promise with a Json object containing the data.
     * @public
     */
    getRifleMods() {
        return this.getTableInfo(this.wikiaSource.link + this.wikiaSource.pages.rifle_mods);
    }

    /**
     * <p>Queries the Shotgun Mods table containing all the Shotgun mods and
     * information relative to them.</p>
     * 
     * @return {Promise} A Promise with a Json object containing the data.
     * @public
     */
    getShotgunMods() {
        return this.getTableInfo(this.wikiaSource.link + this.wikiaSource.pages.shotgun_mods);
    }

    /**
     * <p>Queries the Pistol Mods table containing all the Pistol mods and
     * information relative to them.</p>
     * 
     * @return {Promise} A Promise with a Json object containing the data.
     * @public
     */
    getPistolMods() {
        return this.getTableInfo(this.wikiaSource.link + this.wikiaSource.pages.pistol_mods);
    }

    /**
     * <p>Queries the Melee Mods table containing all the Melee mods and
     * information relative to them.</p>
     * 
     * @return {Promise} A Promise with a Json object containing the data.
     * @public
     */
    getMeleeMods() {
        return this.getTableInfo(this.wikiaSource.link + this.wikiaSource.pages.melee_mods);
    }

    /**
     * <p>Queries the Sentinel Mods table containing all the Sentinel mods and
     * information relative to them.</p>
     * 
     * @return {Promise} A Promise with a Json object containing the data.
     * @public
     */
    getSentinelMods() {
        return this.getTableInfo(this.wikiaSource.link + this.wikiaSource.pages.sentinel_mods);
    }

    /**
     * <p>Queries the Kubrow Mods table containing all the Kubrow mods and
     * information relative to them.</p>
     * 
     * @return {Promise} A Promise with a Json object containing the data.
     * @public
     */
    getKubrowMods() {
        return this.getTableInfo(this.wikiaSource.link + this.wikiaSource.pages.kubrow_mods);
    }

    /**
     * <p>Queries the Aura Mods table containing all the Aura mods and
     * information relative to them.</p>
     * 
     * @return {Promise} A Promise with a Json object containing the data.
     * @public
     */
    getAuraMods() {
        return this.getTableInfo(this.wikiaSource.link + this.wikiaSource.pages.aura_mods);
    }

    /**
     * <p>Queries the Stance Mods table containing all the Stance mods and
     * information relative to them.</p>
     * 
     * @return {Promise} A Promise with a Json object containing the data.
     * @public
     */
    getStanceMods() {
        return this.getTableInfo(this.wikiaSource.link + this.wikiaSource.pages.stance_mods);
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
     * @idea The Wiki should have the SlotType where the mod is to be equiped on
     * the description table. 
     */
    getModInformation(modURL) {

        let self = this;
        return new Promise(function(fulfil, reject) {
            self.requestHTML(modURL).then((htmlBody) => {

                //for everything else
                let $ = cheerio.load(htmlBody);

                //hack to know if this is a stance
                if (htmlBody.includes('<a href="/wiki/Stance" title="Stance">Stance</a>')) {

                    //The Description paragraph always strats with the name of the stance in bold. 
                    let descriptionParagraph = $(htmlBody).find('div').find('p').find('b').parent();

                    let stanceInfo = {
                        Name: $("#WikiaPageHeader > div > div.header-column.header-title > h1").text().trim(),
                        Description: descriptionParagraph.text().trim(),
                        SlotType: "Stance",
                        URL: modURL,
                        Ranks: 3, //all stances have 3 ranks
                        Rarity: $("div.pi-item:nth-child(3) > div:nth-child(2)").text().trim(),
                        TraddingTax: $("div.pi-item:nth-child(4) > div:nth-child(2)").text().trim(),
                        Transmutable: $("#mw-content-text > div > aside > section > div:nth-child(6) > div > div").text().trim() == KEYWORDS.TRANSMUTABLE,
                        ImageURL: $("#mw-content-text > div.tooltip-content.Infobox_Parent > aside > figure > a > img").attr("src")
                    };

                    let polarityNode = $('a.image.image-thumbnail.link-internal').filter((i, el) => {
                        return $(el).attr('title') === 'Polarity';
                    });

                    if (polarityNode.length > 0)
                        stanceInfo.Polarity = polarityNode.find("img").attr("alt").trim().split(" ")[0].trim();


                    let WeaponsList = [];
                    let weaponsListNodes = descriptionParagraph.next().next().find("li");
                    let tmpWeaponObj = {};
                    let tmpWeaponName = "";
                    let tmpWeaponLinkNodes = [];
                    weaponsListNodes.each((index, elem) => {
                        tmpWeaponObj = {};
                        tmpWeaponName = $(elem).text().trim();

                        if (tmpWeaponName.includes("*")) {
                            tmpWeaponObj.Name = tmpWeaponName.replace("*", "");
                            tmpWeaponObj.MatchesPolarity = true;
                        }
                        else {
                            tmpWeaponObj.Name = tmpWeaponName;
                            tmpWeaponObj.MatchesPolarity = false;
                        }

                        tmpWeaponObj.Links = [];
                        tmpWeaponLinkNodes = $(elem).find("a");
                        tmpWeaponLinkNodes.each((linkIndex, linkElem) => {
                            tmpWeaponObj.Links.push($(linkElem).attr("href"));
                        });
                        WeaponsList.push(tmpWeaponObj);
                    });

                    stanceInfo.WeaponsList = WeaponsList;

                    let droppedByDiv = $("#mw-content-text > div.tooltip-content.Infobox_Parent > aside > section > div:nth-child(5) > div").toString();
                    let info = droppedByDiv.split("<br>");
                    let dropInfo = {};
                    let links = "";
                    stanceInfo.DroppedBy = [];
                    for (let tag of info) {
                        dropInfo = {};
                        //remove text between parenthesis, and it is useless and often confuses the parser
                        tag = tag.replace(/ *\([^)]*\) */g, "");
                        dropInfo.Name = $(tag).text().trim() || tag;
                        dropInfo.Links = [];

                        links = $(tag).find("a").add($(tag).filter("a"));

                        $(links).each(function(index, elem) {
                            dropInfo.Links.push($(this).attr("href"));
                        });

                        stanceInfo.DroppedBy.push(dropInfo);
                    }

                    fulfil(stanceInfo);
                }
                else {
                    let modInfo = {
                        Name: $("#WikiaPageHeader > div > div.header-column.header-title > h1").text().trim(),
                        Description: $("#mw-content-text > div.tooltip-content.Infobox_Parent").next().text().trim(),
                        Rarity: $("div.pi-item:nth-child(3) > div:nth-child(2)").text().trim(),
                        TraddingTax: $("div.pi-item:nth-child(4) > div:nth-child(2)").text().trim(),
                        URL: modURL,
                        Transmutable: $("#mw-content-text > div > aside > section > div:nth-child(6) > div > div").text().trim() == KEYWORDS.TRANSMUTABLE,
                        Ranks: $("#mw-content-text > table.emodtable").find("tr").length - 2,
                        ImageURL: $("#mw-content-text > div.tooltip-content.Infobox_Parent > aside > figure > a > img").attr("src")
                    };

                    let polarityNode = $('a.image.image-thumbnail.link-internal').filter((i, el) => {
                        return $(el).attr('title') === 'Polarity';
                    });

                    if (polarityNode.length > 0)
                        modInfo.Polarity = polarityNode.find("img").attr("alt").trim().split(" ")[0].trim();

                    modInfo.Tradable = (modInfo.TraddingTax != KEYWORDS.NA && modInfo.TraddingTax != "");

                    let droppedByDiv = $("#mw-content-text > div.tooltip-content.Infobox_Parent > aside > section > div:nth-child(5) > div").toString();
                    let info = droppedByDiv.split("<br>");
                    let dropInfo = {};
                    let links = "";
                    modInfo.DroppedBy = [];

                    for (let tag of info) {
                        dropInfo = {};
                        //remove text between parenthesis, and it is useless and often confuses the parser
                        tag = tag.replace(/ *\([^)]*\) */g, "");
                        dropInfo.Name = $(tag).text().trim() || tag;
                        dropInfo.Links = [];

                        links = $(tag).find("a").add($(tag).filter("a"));

                        $(links).each(function(index, elem) {
                            dropInfo.Links.push($(this).attr("href"));
                        });

                        modInfo.DroppedBy.push(dropInfo);
                    }

                    fulfil(modInfo);
                }


            }).catch(error => {
                reject("Error with " + modURL + ". Error: " + error);
            });
        });
    }

    /**
     *  <p>Auxiliary method, makes a request to the given URL and receives the 
     *  HTML table from another table. Parses it to extract all valuable 
     *  information and builts a JSON object containing it, which is then 
     *  returned if the promise is fulfilled.</p>
     * 
     *  @param  {string}    url The complete URL of the webpage were the HTML 
     *                          table containing all the information is. 
     *  @return {Promise}       A Promise with a Json object containing the data.   
     *  @private
     */
    getTableInfo(url) {
        let self = this;

        return new Promise((fulfil, reject) => {

            self.requestHTML(url).then((htmlBody) => {
                let $ = cheerio.load(htmlBody);

                //get table
                let table = $("table.listtable.sortable");

                //get rows from table               
                let trList = $(table).find("tr");

                //fill the headers and remove the 1st row as it was processed
                let headers = trList.first().children().text().trim().split("\n");
                headers = headers.map(str => str.trim());
                trList = trList.slice(1, trList.length);

                //aux variables for loop
                let result = [];
                let findCamelCase = new RegExp("([a-z]+[A-Z][a-z]+)");

                $(trList).each(function(index, elem) {
                    let currentTdList = $(this).children();
                    let item = {};
                    let line;
                    for (let tdIndex = 0; tdIndex < headers.length; tdIndex++) {

                        line = currentTdList.eq(tdIndex).text().trim();

                        if (headers[tdIndex] == COLUMN_POLARITY) {
                            item[headers[tdIndex]] = currentTdList.eq(tdIndex).find("img").attr("alt").split(" ")[0];

                            //Because the wikia has conflicting scripts, we must ensure we get the field we want.
                            item[headers[tdIndex] + "Link"] = currentTdList.eq(tdIndex).find("img").attr("data-src");
                            if (!(item[headers[tdIndex] + "Link"]))
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
                            item.PvPOnly = false;
                            if (item[headers[tdIndex]].includes(KEYWORDS.PVP))
                                item.PvPOnly = true;
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
                            reject("ConnectionTimeoutException for " + url);
                        else
                        //The wiki server is too slow responding (likely overload)
                            reject("ReadTimeoutException for " + url);
                    }
                    else
                    //general error ocurred
                        reject("PageUnreacheableException for " + url);
                });
        });
    }
}

module.exports = ModScraper;