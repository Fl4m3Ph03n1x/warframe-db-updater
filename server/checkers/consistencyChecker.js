"use strict";

let chai = require("chai"),
    expect = chai.expect;

//Do multiple references of the same item have the same information?
let consistencyCheckerFactory = function() {

    //Do different sources report the same informaiton about the same item?
    let arePropertiesConsistent = function(prop1, prop2) {
        expect(prop1).to.deep.eql(prop2);
    };

    return Object.freeze({
        arePropertiesConsistent
    });
};

module.exports = consistencyCheckerFactory;