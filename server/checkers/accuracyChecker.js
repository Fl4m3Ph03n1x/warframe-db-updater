"use strict";

let chai = require("chai"),
    expect = chai.expect;
let HTTPStatus = require('http-status');

/**
 *  Provides methods to answer the question:
 *  Do these values depict reality? AKA, are the links and other info existent?
 *  
 *  @param  {Object}    args    Object containing a property called "requestFn", 
 *                              which is the function to be used when making 
 *                              GET requests to the wikia. I am injecting this 
 *                              dependency here so I can test both the checker
 *                              and the GET function to be used.
 *  @return {Object}    Returns an immutable object with methods for basic 
 *                      accuracy checking.
 * @see     https://www.youtube.com/watch?v=0X1Ns2NRfks
 */
let accuracyCheckerFactory = function(args) {
    let {
        requestFun
    } = args;

    /**
     *  Uses the request function passed to make an HTTP GET request to the 
     *  given URL. Checks the response status to make sure the URL exists by 
     *  checking if the response is 200 or 403.
     *  
     *  I accept OK (200) and FORBIDDEN (403) because since the requests 
     *  will be made automatically, some warframe websites will require 
     *  login, which won't be provided in the request. Thus, getting a 403
     *  status doesn't mean the website doesn't exist, it simply means that
     *  we don't have access.
     * 
     *  @param  {string}            url The url to test. 
     *  @throws AssertionException  If the check fails any of the conditions.
     */
    let doesURLExist = function(url) {
        let acceptedStatuses = [HTTPStatus.OK, HTTPStatus.FORBIDDEN];

        return requestFun(url)
            .then(response => {
                expect(acceptedStatuses).to.include(response.statusCode);
            });
    };

    return Object.freeze({
        doesURLExist
    });
};

module.exports = accuracyCheckerFactory;