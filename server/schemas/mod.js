"use strict";

let mongoose = require("mongoose");

const RARITY_TYPES = ["Common", "Uncommon", "Rare", "Legendary", "Riven"];
const POLARITY_TYPES = ["Vazarin", "Madurai", "Naramon", "Zenurik", ];
const SLOT_TYPES = ["Warframe", "Rifle", "Shotgun", "Pistol", "Melee", "Kubrow", "Kavat", "Sentinel", "Aura", "Stance", "Eximus"];

let modSchema = {
    name: {type: String, required: true},
    description: {type: String, required: true},
    rarity: {type: String, enum: RARITY_TYPES, required: true},
    traddingTax: {type: Number},
    url: {type: String, match: /^http:\/\//i, required: true},
    transmutable: {type: Boolean, required: true},
    ranks: {type: Number, required: true},
    imageURL: {type: String, match: /^http:\/\//i},
    polarity: {type: String, enum: POLARITY_TYPES, required: true},
    droppedBy: [{
        name: {type: "String", required: true},
        urls: [{type: String, match: /^http:\/\//i}]
    }],
    slot: {type: String, enum: SLOT_TYPES, required: true}
};

let schema = new mongoose.Schema(modSchema);

schema.virtual("tradable").get(() => {
    return this.traddingTax !== "undefined";
});

schema.set("toObject", {virtuals: true});
schema.set("toJson", {virtuals: true});

module.exports = schema;
module.exports.modSchema = modSchema;