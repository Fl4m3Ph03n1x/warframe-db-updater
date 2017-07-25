"use strict";

const serializeError = require('serialize-error');

const exception = require("../exception.js");

/**
 *  Factory that returns log objects capable of creating log files.
 * 
 *  @param {Object} args    An object containing the arguments for this factory.
 *                          This object must have an errorParams object, with 
 *                          the definitions for the errors.
 */
const logFactory = function(args) {

    let {
        errorParams
    } = args;

    /**
     *  Creates an error log regarding a data error. This function is used to 
     *  create log files about data Accuracy, Consistency and Validity errors.
     * 
     *  @param  {Object}    info    An object with the error information that 
     *                              will be printed in the log.
     */
    const createLog = function(info) {
        errorParams.exceptionName = info.exceptionName;
        exception(errorParams).write({
            exception: info.exception,
            item: info.item
        });
    };

    /**
     *  Creates an error log regarding a server errors. This function is used to 
     *  create log files when the server code fails or has issues.
     * 
     *  We use serializeError because JavaScript will not print the message and
     *  stack unless forced. 
     * 
     *  @param  {Object}    error   An object with the error information that 
     *                              will be printed in the log.
     */
    const createServerLog = function(error) {
        errorParams.exceptionName = "ServerError.json";
        exception(errorParams).write(serializeError(error));
    };

    return Object.freeze({
        createLog,
        createServerLog
    });
};

module.exports = logFactory;