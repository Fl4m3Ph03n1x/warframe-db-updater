"use strict";

const chai = require("chai"),
    expect = chai.expect;

/**
 *  Provides methods to answer the question:
 *  Do multiple references of the same item have the same information?
 *  
 *  @return {Object}    Returns an immutable object with methods for basic 
 *                      accuracy checking.
 *  @see    https://www.youtube.com/watch?v=0X1Ns2NRfks
 */
let consistencyCheckerFactory = function() {

    let arePropertiesConsistent = function(prop1, prop2) {
        expect(prop1).to.deep.eql(prop2);
    };

    return Object.freeze({
        arePropertiesConsistent
    });
};

module.exports = consistencyCheckerFactory;