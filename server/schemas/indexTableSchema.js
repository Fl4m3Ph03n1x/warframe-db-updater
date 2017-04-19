"use strict";

const mongoose = require("mongoose");

const indexTableSchema = require("./baseInfo.js");

module.exports = new mongoose.Schema(indexTableSchema);
module.exports.indexTableSchema = indexTableSchema;