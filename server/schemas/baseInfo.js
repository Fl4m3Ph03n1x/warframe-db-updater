"use strict";

const RARITY_TYPES = ["Common", "Uncommon", "Rare", "Legendary", "Riven"];
const POLARITY_TYPES = ["Vazarin", "Madurai", "Naramon", "Zenurik", ];
const SLOT_TYPES = ["Warframe", "Rifle", "Shotgun", "Pistol", "Melee", "Kubrow", "Kavat", "Sentinel", "Aura", "Stance", "Eximus"];
const SUBCATEGORY_TYPES = ["Nightmare", "Corrupted", "Acolyte"];
const SYNDICATES = ["The Perrin Sequence", "Red Veil", "New Loka", "Cephalon Suda", "Arbiters of Hexis", "Steel Meridian", "Conclave", "Cephalon Simaris"];
const GAME_TYPES = ["PvE", "PvP", "Archwing"];

module.exports = {
    name: {
        type: String,
        required: true,
        unique: true
    },
    url: {
        type: String,
        required: true,
        unique: true,
        match: /^http:\/\//i
    },
    description: {
        type: String,
        required: true
    },
    polarity: {
        type: String,
        enum: POLARITY_TYPES,
        required: true
    },
    polarityLink: {
        type: String,
        match: /^https:\/\//i,
        required: true
    },
    rarity: {
        type: String,
        enum: RARITY_TYPES,
        required: true
    },
    slotType: {
        type: String,
        enum: SLOT_TYPES,
        required: true
    },
    subcategory: {
        type: String,
        enum: SUBCATEGORY_TYPES
    },
    subcategoryLink: {
        type: String,
        match: /^http:\/\//i
    },
    syndicate: {
        type: String,
        enum: SYNDICATES
    },
    syndicateLink: {
        type: String,
        match: /^https:\/\//i
    },
    gameModes: {
        type: [{
            type: String,
            enum: GAME_TYPES
        }],
        validate: [minSize, '{PATH} cannot be empty']
    },
    lastModifiedDate: {
        required: true,
        type: Date
    }
};

function minSize(val) {
  return val.length > 0;
}