/**
 * Returns `value` after a slight delay.
 * Simulates some processing or whatnot.
 *
 * @param {any} value
 */
function heavyProcessing(value, time) {
    return new Promise(resolve => setTimeout(resolve, time, value));
}

/**
 * The returned promise will **almost** never resolve :(
 */
function badPromise(value) {
    return heavyProcessing(value, 1e9);
}

/**
 * This is a list of functions that will give you a promise.
 * Your job is to process everything as fast as you can, and display each values by calling the functions that will spawn the jobs.
 * (`console.log` is good).
 */
const jobFactories = [1, -2, 3, -4, "patate", badPromise('huehuehue'), Math.PI, NaN, Infinity].map(value => () => heavyProcessing(value, 3000));

/**
 * Here I just create an async function for your to use Node's best practices of doing async stuff :)
 * You can only use `await` in the body of an async function. But you can still use the `then` and `catch` callback notation.
 */
(async function yourProcessingGoesHere() {

    // Write your code here ;)

    // Here is a bad hint for iterating over the values:
    for (const job of jobFactories) {
        console.log(await job());
    }

})();
