"use strict";

//Personal Libs
const logFactory = require("../../utils/logCreator.js");
const resultsChecker = require("../resultsChecker.js");
const warframeChecker = require("./warframeMod.js");
const warframeIndexTableChecker = require("./warframeIndex.js");

const {
    IndexTable,
    Mod
} = require("../../db/models.js").getModels();


module.exports = function(warframeIndexList, args) {

    const {
        wikiaURL,
        scrapy
    } = args;

    const logger = logFactory(args);
    const checker = resultsChecker(logger);
    const checkWarframeIndex = warframeIndexTableChecker(args);
    const checkWarframeMod = warframeChecker(args);

    const fullCheck = warframeIndexList.reduce((prev, item) => {

        prev.push(
            (async function() {

                //check index table data
                checker(await checkWarframeIndex.isValid(item));
                checker(await checkWarframeIndex.isAccurate(item));

                //check detailed mod data
                const details = await scrapy.getModInformation(wikiaURL + item.nameLink);
                checker(await checkWarframeMod.isValid(details));
                checker(await checkWarframeMod.isAccurate(details));

                //check for consistency between mod and index table
                checker(await checkWarframeIndex.isConsistent(item, details));

                //if new WarframeIndex, save it, otherwise update it.
                const indexItem = await IndexTable.findOne({
                    name: item.name
                });

                if (indexItem === null) {

                    item.slotType = "Warframe";
                    item.gameModes = ["PvE"];
                    item.url = wikiaURL + item.nameLink;
                    item.nameLink = undefined;
                    if (item.subcategory === "None")
                        item.subcategory = undefined;
                    else
                        item.subcategoryLink = wikiaURL + item.subcategoryLink;

                    item.lastModifiedDate = Date.now();

                    await new IndexTable(item).save();
                    console.log(`Saved ${item.name}`);
                }
                else {
                    //check to see if there are differences

                    indexItem.lastModifiedDate = Date.now();
                    console.log(`Updated ${item.name}`);
                }

                //if new WarframeMod save it, otherwise update it
                // const detailItem = await WarframeMod.findOne({
                //     name: item.name
                // });

                // if (detailItem === null) {

                //     details.slotType = "Warframe";
                //     details.url = wikiaURL + details.nameLink;
                //     details.nameLink = undefined;
                //     details.warframeType = "Any";
                //     if (details.subcategory === "None")
                //         details.subcategory = undefined;
                //     else
                //         details.subcategoryLink = wikiaURL + details.subcategoryLink;
                    
                //     details.lastModifiedDate = Date.now();

                //     await new WarframeMod(details).save();
                //     console.log(`Saved ${details.name}`);
                // }
                // else {
                //     //check to see if there are differences

                //     indexItem.lastModifiedDate = Date.now();
                //     console.log(`Updated ${item.name}`);
                // }
            }())
            .catch(logger.createServerLog)
        );

        return prev;
    }, []);

    return Promise.all(fullCheck);
};