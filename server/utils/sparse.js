"use strict";

/**
 *  Executes the given function with delayMs. This is useful when you have a ton
 *  of requests you need to do, but you can't do all of them at the same time to 
 *  a avoid resouce stampede (like overloading a server with a million of GET 
 *  requests).
 * 
 *  This function, will receive the given one, and return a function that you 
 *  can execute normally, any given number of times you want. However, the 
 *  returned function will actually be run only every delayMs. 
 * 
 *  This superseeds throttle, as with throttle you ignore all exceededing 
 *  functions, and debounce, and it has a simillar behavior. In this
 *  implementation, all calls will **always** be executed, but with the given 
 *  delay. 
 *  
 *  @param      {function}  fun     The function that we which to sparse.
 *  @param      {number}    delayMs The delay of the sparsing in milliseconds. 
 *  @returns    {function}  A new function that runs the given one with delayMs
 *                          of wait between each execution.
 *  @see        {@link  http://stackoverflow.com/questions/42651439/how-to-delay-execution-of-functions-javascript}
 */
let sparse = (fun, delayMs) => {

    let lastCallTime = Date.now();
    return function(...args) {


        return new Promise((fulfil, reject) => {

            const now = Date.now();
            const thisDelay = Math.max(delayMs, lastCallTime - now + delayMs);
            lastCallTime = now + thisDelay;

            setTimeout(() => {

                fun(...args)
                    .then(fulfil)
                    .catch(reject);

            }, thisDelay);
        });

    };
};

module.exports = sparse;