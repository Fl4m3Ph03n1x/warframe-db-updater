"use strict";

let ModScraper = require("./promisedScraper.js");
let app = require("./server");

let HTTPStatus = require("http-status");
let assert = require("assert");
let superagent = require("superagent");
let jsonfile = require("jsonfile");
let values = require("object.values");
let chai = require("chai"),
    expect = chai.expect;

const SCRAPER_CONFIG_FILE = "./scraperConfig.json";

// describe("server", () => {
//     let server;

//     beforeEach(() => {
//         server = app().listen(process.env.PORT);
//     });

//     afterEach(() => {
//         server.close();
//     });

//     it("prints hello world  when user visits '/'", done => {
//         superagent.get(process.env.IP + ":" + process.env.PORT, (error, res) => {
//             assert.ifError(error);
//             assert.equal(res.status, 200);
//             assert.equal(res.text, "Hello World");
//             done();
//         });
//     });
// });

describe("connections", () => {
    let config = jsonfile.readFileSync(SCRAPER_CONFIG_FILE);
    let wikiaUri = config.sources.wikia.link;
    let wikiaPages = values(config.sources.wikia.pages);
    let completeUri;

    for (let pageUri of wikiaPages) {
        completeUri = wikiaUri + pageUri;
        it("connects to " + completeUri, done => {
            superagent.get(completeUri, (error, res) => {
                assert.ifError(error);
                assert.equal(res.status, 200);
                done();
            });
        });
    }
});

//@todo check data analysis tutorials for mongodb
describe("scraper", () => {
    
    const TYPE = {
        RARITIES: ["Common", "Uncommon", "Rare", "Legendary", "Riven"],
        POLARITIES: ["Vazarin", "Madurai", "Naramon", "Zenurik"],
        CATEGORIES: ["None", "Acolyte", "Corrupted", "Nightmare"]
    };
    
    let config;
    let wikiaUri;
    let scrapy;

    before(() => {
        config = jsonfile.readFileSync(SCRAPER_CONFIG_FILE);
        wikiaUri = config.sources.wikia.link;
        scrapy = new ModScraper(config);
    });

    it("test warframe_mods overview table", done => {
        scrapy.getWarframeMods()
            .then(result => {
                for (let item of result) {

                    expect(item).to.have.property("NameLink");
                    expect(item.NameLink).to.be.a("string");
                    expect(item.NameLink).to.not.be.empty;
                    superagent.get(wikiaUri + item.NameLink, (error, res) => {
                        expect(error).to.not.exist;
                        expect(res.status).to.equal(HTTPStatus.OK);
                    });

                    expect(item).to.have.property("Name");
                    expect(item.Name).to.be.a("string");
                    expect(item.Name).to.not.be.empty;

                    expect(item).to.have.property("Description");
                    expect(item.Description).to.be.a("string");
                    expect(item.Description).to.not.be.empty;
                    expect(item.Description[item.Description.length - 1]).to.equal("."); //Each description must terminate with correct puntuation. I am freak rigth? xD

                    expect(item).to.have.property("PvPOnly");
                    expect(item.PvPOnly).to.be.a("boolean");

                    expect(item).to.have.property("Polarity");
                    expect(item.Polarity).to.be.a("string");
                    expect(TYPE.POLARITIES).to.include(item.Polarity);

                    expect(item).to.have.property("PolarityLink");
                    expect(item.PolarityLink).to.be.a("string");
                    expect(item.PolarityLink).to.not.be.empty;
                    superagent.get(item.PolarityLink, (error, res) => {
                        expect(error).to.not.exist;
                        expect(res.status).to.equal(HTTPStatus.OK);
                    });

                    expect(item).to.have.property("Rarity");
                    expect(item.Rarity).to.be.a("string");
                    expect(TYPE.RARITIES).to.include(item.Rarity);

                    if (item.CategoryLink) {
                        expect(item.CategoryLink).to.be.a("string");
                        expect(item.CategoryLink).to.not.be.empty;
                        superagent.get(wikiaUri + item.CategoryLink, (error, res) => {
                            expect(error).to.not.exist;
                            expect(res.status).to.equal(HTTPStatus.OK);
                        });
                    }

                    expect(item).to.have.property("Category");
                    expect(item.Category).to.be.a("string");
                    expect(TYPE.CATEGORIES).to.include(item.Category);
                }

                done();
            })
            .catch(error => {
                console.log(error);
                done();
            });
    });
});