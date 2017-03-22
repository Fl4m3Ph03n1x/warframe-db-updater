"use strict";

const serializeError = require('serialize-error');

const exception = require("../Exception.js");

let logFactory = function(args) {

    let {
        errorParams
    } = args;
    
    let createLog = function(info) {
        errorParams.exceptionName = info.exceptionName;
        exception(errorParams).write({
            exception: info.exception,
            item: info.item
        });
    };

    let createServerLog = function(error) {
        errorParams.exceptionName = "ServerError.json";
        exception(errorParams).write(serializeError(error));
    };


    return Object.freeze({
        createLog,
        createServerLog
    });
};

module.exports = logFactory;