"use strict";

let jsonfile = require("jsonfile");
let _ = require("underscore");

let exceptionFactory = function(args) {
    let {
        outputFolder,
        fileExtension,
        exceptionName,
        message,
        outputFileName,
        useExceptionName
    } = args;
    
    
    
    if(useExceptionName === true && !_.isUndefined(exceptionName))
        outputFileName = exceptionName  + "_" + _.now();
    
    let filePath = outputFolder + outputFileName + fileExtension;
    
    let write = function(info) {
        
        jsonfile.writeFileSync(filePath, info || message, {spaces: 4}, error => {
            if (!_.isNull(error) )
                console.log(error);
        });
    };

    return Object.freeze({
        createTime: _.now(),
        write
    });
};

module.exports = exceptionFactory;