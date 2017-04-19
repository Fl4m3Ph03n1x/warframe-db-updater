"use strict";

const mongoose = require("mongoose");

const indexTableSchema = require("./baseIndex.js");

module.exports = new mongoose.Schema(indexTableSchema);
module.exports.indexTableSchema = indexTableSchema;