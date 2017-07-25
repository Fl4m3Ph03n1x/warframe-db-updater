"use strict";

/**
 *  Receives an array of functions, executes them and returns a map for each 
 *  function that details if the execution failed or succeeded. 
 *  
 *  Beause Promise.all either returns an array of all the values from the 
 *  executed Promises or it blow up at the first error, we need to keep it from 
 *  blowing by instead returning an object that details if that execution failed
 *  or succeeded. 
 *
 * @param   {array} values  An array of functions that were promisified. 
 * @returns {array}   An array containing the execution object for each function.
 * @see {@link  http://stackoverflow.com/questions/42839462/promise-then-and-catch-clauses-not-working}
 */
const allSettled = function(values) {
    let settle =
        value => Promise.resolve(value)
        .then(result => ({
            state: "fulfilled",
            value: result
        }))
        .catch(error => ({
            state: "rejected",
            reason: error
        }));

    return Promise.all(values.map(settle));
};

/**
 *  Receives a function, and returns a Promise with the execution of its values. 
 *  Since the mapExecution function can receive functions which may, or may not 
 *  be Promises, we simply promisify all functions before execution.
 * 
 * @param   {function}  fun     The function whose result is to be promisified.
 * @param   {array}     args    An array of arguments, build using the REST 
 *                              operator. Since we don't know how many arguments
 *                              our functions will need to execute, we do it this
 *                              way.
 * @returns {Promise}     A resolved Promise with the result of the executed 
 *                      function.
 * @see {@link http://stackoverflow.com/questions/42808381/how-can-i-use-promises-to-catch-errors-when-they-might-not-be-wrapped-in-a-promi}
 */
const promisify = function(fun, ...args) {
    //we never reject here
    return new Promise(fulfil => {
        fulfil(fun(...args));
    });
};

/**
 *  Puts together both previous functions, and returns an array with the 
 *  execution objects of each function.
 * 
 * @param   {array} funArray    An array of functions to be executed.
 * @param   {array} args        An array of arguments, build using the REST 
 *                              operator. In this case, all the functions take 
 *                              the same variable number of arguments.
 * @returns {Promise} A resolved Promise with an array of execution objects for 
 *                  each executed function.
 */
const mapExecution = function(funArray, ...args) {
    return allSettled(funArray.map(fun => promisify(fun, ...args)));
};

module.exports = mapExecution;