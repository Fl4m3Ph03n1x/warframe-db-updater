"use strict";

const jsonfile = require("jsonfile");

/**
 *
 */
let exceptionFactory = function(args) {
    let {
        outputFolder,
        fileExtension,
        exceptionName,
        message,
        outputFileName,
        useExceptionName
    } = args;

    if (useExceptionName === true && exceptionName !== undefined)
        outputFileName = exceptionName + "_" + Date.now();

    let filePath = outputFolder + outputFileName + fileExtension;

    let write = function(info) {
        jsonfile.writeFileSync(filePath, info || message, {spaces: 4}, error => {
            if (error !== null)
                console.log(error);
        });
    };

    return Object.freeze({
        createTime: Date.now(),
        write
    });
};

module.exports = exceptionFactory;