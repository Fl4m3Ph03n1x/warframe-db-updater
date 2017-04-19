"use strict";

const mongoose = require("mongoose");
const baseIndex = require("./baseIndex.js");

const WARFRAME_TYPES = [
    "Any",
    "Ash", "Atlas", "Banshee", "Chroma", "Ember", "Equinox", "Excalibur",
    "Frost", "Hydroid", "Inaros", "Ivara", "Limbo", "Loki", "Mag", "Mesa",
    "Mirage", "Nekros", "Nezha", "Nidus", "Nova", "Nyx", "Oberon", "Octavia",
    "Rhino", "Saryn", "Titania", "Trinity", "Valkyr", "Vauban", "Volt",
    "Wukong", "Zephyr"
];

const warframeModFactory = function(aBaseIndex) {

    const warframeIndex = Object.assign({}, aBaseIndex);
    
    warframeIndex.warframeType = {
        type: String,
        enum: WARFRAME_TYPES,
        required: true
    };
    
    return Object.freeze(warframeIndex);
};


const warframeModSchema = warframeModFactory(baseIndex);

module.exports = new mongoose.Schema(warframeModSchema);
module.exports.warframeModSchema = warframeModSchema;