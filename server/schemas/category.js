"use strict";

let mongoose = require("mongoose");

let categorySchema = {
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    rarity: {
        level: {
            enum: ["Common", "Uncommon", "Rare", "Primed"],
            required: true
        },
        type: {
            enum: ["Normal", "Nightmare", "Corrupted", "Syndicate"] //(Only if rarity.level == “Rare”)
        }
    },
    traddingTax: {
        type: Number
    },
    rank: {
        type: Number
    },
    transmutable: {
        type: Boolean
    },
    featuredBuilds: [{
        type: String,
        match: /^http:\/\//i
    }],
    // itemCategories: [itemCategorySchema](item type ex: warframe, primary, secondary and etc… are obtained form itemCategory),
    updated: {
        type: Date,
        default: Date.now
    }
};
