"use strict";

const mongoose = require("mongoose");
const BaseIndex = require("./baseIndex.js");

const WARFRAME_TYPES = [
    "Ash", "Atlas", "Banshee", "Chroma", "Ember", "Equinox", "Excalibur",
    "Frost", "Hydroid", "Inaros", "Ivara", "Limbo", "Loki", "Mag", "Mesa",
    "Mirage", "Nekros", "Nezha", "Nidus", "Nova", "Nyx", "Oberon", "Octavia",
    "Rhino", "Saryn", "Titania", "Trinity", "Valkyr", "Vauban", "Volt",
    "Wukong", "Zephyr"
];

const SYNDICATES = [
    "The Perrin Sequence", "Red Veil", "New Loka", "Cephalon Suda", 
    "Arbiters of Hexis", "Steel Meridian", "Conclave", "Cephalon Simaris"
];

let warframeIndexSchema = {
    baseIndex: BaseIndex.indexSchema,
    warframeType: { type: String, enum: WARFRAME_TYPES, required: true},
    syndicate: {type: String, enum: SYNDICATES}
};

module.exports = new mongoose.Schema(warframeIndexSchema);
module.exports.warframeIndexSchema = warframeIndexSchema;