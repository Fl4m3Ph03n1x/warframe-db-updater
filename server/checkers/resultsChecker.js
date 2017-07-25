"use strict";

/**
 *  Creates a log for each error existing in the results array. 
 * 
 *  @param  {log}     logger  The logger object responsible for creating the log 
 *                          files about the error.
 *  @param  {array}   results The array os results to be examined for errors.
 */
let checkResults = function(logger, results) {
    results
        .filter(result => result.state === "rejected")
        .forEach(obj => logger.createLog(obj.reason));
};

/**
 *  This factory makes use of Inversion of Control, so everytime we call the 
 *  checkResults function we don't have to pass the logger as an argument.
 *  
 *  @param      {log}       logger  The logger object responsible for creating the 
 *                                  log files about the error.
 *  @returns    {function}  The checkResults funciton bound to the given logger.
 *  @see {@link https://www.youtube.com/watch?v=-kpEP4JeEdc}
 */
let checkResultsFactory = function(logger) {
    return checkResults.bind(null, logger);
};

module.exports = checkResultsFactory;