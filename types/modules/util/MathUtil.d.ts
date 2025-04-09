/**
 * The method will increase the given number by 1. If the given counter is equal
 * or greater to {@link Number.MAX_SAFE_INTEGER} then it will be rolled back to
 * 1.
 * @param {number} number - An integer counter value to be incremented.
 * @return {number} the next counter value increased by 1 (see the description
 * above for exception).
 */
export declare function safeCounterIncrement(number: number): number;
/**
 * Calculates the average value of an Array of numbers.
 *
 * @param {Float32Array} valueArray - Array of numbers.
 * @returns {number} - Number array average.
 */
export declare function calculateAverage(valueArray: Float32Array): number;
/**
 * Calculates a unique hash for a given string similar to Java's
 * implementation of String.hashCode()
 *
 * @param {string} string - String whose hash has to be calculated.
 * @returns {number} - Unique hash code calculated.
 */
export declare function hashString(string: string): number;
/**
 * Returns only the positive values from an array of numbers.
 *
 * @param {Float32Array} valueArray - Array of vad scores.
 * @returns {number[]} - Array of positive numbers.
 */
export declare function filterPositiveValues(valueArray: Float32Array): number[];
/**
 * This class calculates a simple running average that continually changes
 * as more data points are collected and added.
 */
export declare class RunningAverage {
    private average;
    private n;
    /**
     * Creates an instance of the running average calculator.
     */
    constructor();
    /**
     * Adds a new data point to the existing set of values and recomputes
     * the running average.
     * @param {number} value
     * @returns {void}
     */
    addNext(value: number): void;
    /**
     * Obtains the average value for the current subset of values.
     * @returns {number} - computed average.
     */
    getAverage(): number;
}
/**
 * Subtracts the two numbers passed or returns 0 if any of the arguments are not a number.
 *
 * @param {*} x - The number we subtract from.
 * @param {*} y - The number we subtract.
 * @returns {number} - x - y or 0 if x or y is not a number.
 */
export declare function safeSubtract(x: any, y: any): number;
/**
 * Checks if the given value is a valid number.
 *
 * @param n - The value to check.
 * @returns - `true` if the value is a valid number, `false` otherwise.
 */
export declare function isValidNumber(n: any): boolean;
