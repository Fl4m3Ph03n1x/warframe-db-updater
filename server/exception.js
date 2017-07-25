"use strict";

const jsonfile = require("jsonfile");

/**
 *  Factory that returns an exception handler, capable of writting a log file 
 *  with the given execption error. 
 * 
 *  @param {Object} args    An object containign the fields:
 *                          - outputFolder: string, the destination of the 
 *                              folder where the files will be written.
 *                          - fileExtension: string,  the extentsion of the 
 *                              created file. 
 *                          - exceptionName: string,  the name of the exception. 
 *                          - message: string, the error message we want to 
 *                              write.
 *                          - outputFileName: string, the name of the file. 
 *                          - useExceptionName: boolean, if true will include 
 *                              the exception name in the file name.
 * @returns {Object}    An exception object, with a write method to create the 
 *                      log file and createTime defining when it was created.
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