"use strict";

let mongoose = require("mongoose");

let modSchema = {
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
    wikiaLink: {
        type: String,
        match: /^http:\/\//i,
        required: true
    },
    updated: {
        type: Date,
        default: Date.now
    },
    modType: {
        type: {
            enum: ["Warframe", "Rifle", "Pistol", "Shotgun", "Melee", "Sentinel", "Kubrow", "Kavat"],
            required: true
        }
    },
    gameType: {
        type: {
            enum: ["Cooperative", "Conclave", "Archwing"],
            required: true
        }
    },
    userTypDe: {
        type: {
            enum: ["Player", "Companion"],
            required: true
        }
    }
};
