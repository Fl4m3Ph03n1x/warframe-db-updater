"use strict";

const mongoose = require("mongoose");

const RARITY_TYPES = ["Common", "Uncommon", "Rare", "Legendary", "Riven"];
const POLARITY_TYPES = ["Vazarin", "Madurai", "Naramon", "Zenurik", ];
const SLOT_TYPES = ["Warframe", "Rifle", "Shotgun", "Pistol", "Melee", "Kubrow", "Kavat", "Sentinel", "Aura", "Stance", "Eximus"];
const SUBCATEGORY_TYPES = ["Nightmare", "Corrupted", "Acolyte"];

let indexSchema = {
    name: {type: String, required: true},
    description: {type: String, required: true},
    polarity: {type: String, enum: POLARITY_TYPES, required: true},
    rarity: {type: String, enum: RARITY_TYPES, required: true},
    url: {type: String, match: /^http:\/\//i, required: true},
    slotType: {type: String, enum: SLOT_TYPES, required: true},
    subcategory: {type: String, enum: SUBCATEGORY_TYPES}
};

module.exports = new mongoose.Schema(indexSchema);
module.exports.indexSchema = indexSchema;