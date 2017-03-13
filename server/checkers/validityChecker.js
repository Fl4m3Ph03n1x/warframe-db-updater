"use strict";

let URL = require('url-parse');
let chai = require("chai"),
    expect = chai.expect;

/**
 *  Provides methods to answer the question:
 *  Does the item conform tos our DB schema?
 *  
 *  @return {Object}    Returns an immutable object with methods for basic 
 *                      validity checking. 
 */
let validityCheckerFactory = function() {

    /**
     *   Checks if the given mod:
     *      1. Has the given property, 
     *      2. If the property is of type string 
     *      3. If the property is not an empty string 
     *  
     *  @param  {Object}            mod         The mod object.
     *  @param  {string}            propName    The name of the property to be 
     *                                          tested.
     *  @throws AssertionException              If the check fails any of the 
     *                                          conditions.
     */
    let hasValidStringProp = function(mod, propName) {
        expect(mod).to.have.property(propName);
        expect(mod[propName]).to.be.a("string");
        expect(mod[propName]).to.not.be.empty;
    };

    /**
     *  Checks if the given url matches an URL regex based on  
     *  http://stackoverflow.com/a/3809435/1337392
     *  
     *  @param  {string}            anURL   The url.
     *  @throws AssertionException  If the url doesn't match the regex.
     */
    let isValidURL = function(anURL) {
        let urlRegex = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
        expect(anURL).to.match(urlRegex);
    };

    /**
     *   Checks if the given mod:
     *      1. Has the given property, 
     *      2. If the property is a valid string property via hasValidStringProp
     *      3. If the property is a valid URL via isValidURL
     *  
     *  @param  {Object}            mod         The mod object.
     *  @param  {string}            propName    The name of the property to be 
     *                                          tested.
     *  @see     hasValidStringProp
     *  @see     isValidURL
     */
    let hasValidURLProp = function(mod, propName) {
        hasValidStringProp(mod, propName);
        isValidURL(mod[propName]);
    };

    /**
     *   Checks if the given mod:
     *      1. Has the given property, 
     *      2. If the property is of type number 
     *      3. If the property is not NaN
     *      4. If the property is greater than 0
     *  
     *  @param  {Object}            mod         The mod object.
     *  @param  {string}            propName    The name of the property to be 
     *                                          tested.
     *  @throws AssertionException              If the check fails any of the 
     *                                          conditions.
     */
    let hasValidNumberProp = function(mod, propName) {
        expect(mod).to.have.property(propName);
        expect(mod[propName]).to.be.a("number");
        expect(mod[propName]).not.to.be.NaN;
        expect(mod[propName]).to.be.above(0);
    };

    /**
     *   Checks if the given mod:
     *      1. Has the given property, 
     *      2. If the property is of type boolean 
     *  
     *  @param  {Object}            mod         The mod object.
     *  @param  {string}            propName    The name of the property to be 
     *                                          tested.
     *  @throws AssertionException              If the check fails any of the 
     *                                          conditions.
     */
    let hasValidBooleanProp = function(mod, propName) {
        expect(mod).to.have.property(propName);
        expect(mod[propName]).to.be.a("boolean");
    };

    /**
     *   Checks if the given mod:
     *      1. Has the given property, 
     *      2. If the property is a valid string property via hasValidStringProp
     *      3. If that property is one of the value inside the anArray property
     *  
     *  @param  {Object}            mod         The mod object.
     *  @param  {string}            propName    The name of the property to be 
     *                                          tested.
     *  @param  {Array}             anArray     The array of valid values that 
     *                                          must contain the propName's 
     *                                          value.
     *  @throws AssertionException              If the check fails check num #3.
     * @see     hasValidStringProp
     */
    let isKnownTypeProp = function(mod, propName, anArray) {
        hasValidStringProp(mod, propName);
        expect(anArray).to.include(mod[propName]);
    };

    /**
     *   Checks if the given mod:
     *      1. Has the given property, 
     *      2. If the property is of type Array 
     *  
     *  @param  {Object}            mod         The mod object.
     *  @param  {string}            propName    The name of the property to be 
     *                                          tested.
     *  @throws AssertionException              If the check fails any of the 
     *                                          conditions.
     */
    let hasValidArrayProp = function(mod, propName) {
        expect(mod).to.have.property(propName);
        expect(mod[propName]).to.be.an("Array");
    };

    return Object.freeze({
        hasValidStringProp,
        hasValidURLProp,
        hasValidNumberProp,
        hasValidBooleanProp,
        isKnownTypeProp,
        hasValidArrayProp,
        isValidURL
    });
};

module.exports = validityCheckerFactory;