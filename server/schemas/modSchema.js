"use strict";

const mongoose = require("mongoose");

const WARFRAME_TYPES = [
    "Any",
    "Ash", "Atlas", "Banshee", "Chroma", "Ember", "Equinox", "Excalibur",
    "Frost", "Hydroid", "Inaros", "Ivara", "Limbo", "Loki", "Mag", "Mesa",
    "Mirage", "Nekros", "Nezha", "Nidus", "Nova", "Nyx", "Oberon", "Octavia",
    "Rhino", "Saryn", "Titania", "Trinity", "Valkyr", "Vauban", "Volt",
    "Wukong", "Zephyr"
];

const partialModSchema = {
    warframeType: {
        type: String,
        enum: WARFRAME_TYPES,
        required: true
    },
    traddingTax: {
        type: Number
    },
    transmutable: {
        type: Boolean,
        required: true
    },
    ranks: {
        type: Number,
        required: true
    },
    imageURL: {
        type: String,
        match: /^http:\/\//i,
        required: true
    },
    droppedBy: [{
        name: { type: "String", required: true },
        urls: [{ type: String, match: /^http:\/\//i }]
    }]
};

const modSchema = new mongoose.Schema(Object.assign({}, require("./baseInfo.js"), partialModSchema));


modSchema.virtual("tradable").get(() => {
    return this.traddingTax !== undefined;
});

modSchema.set("toObject", {
    virtuals: true
});
modSchema.set("toJson", {
    virtuals: true
});

module.exports = modSchema;
module.exports.modSchema = modSchema;