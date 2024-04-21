/**
 * Calculator class to perform basic arithmetic operations.
 */
class Calculator {
  /**
   * Adds two numbers.
   * @param {number} a - The first number.
   * @param {number} b - The second number.
   * @returns {number} The sum of the two numbers.
   */
  static add(a: number, b: number): number {
    return a + b
  }

  /**
   * Subtracts one number from another.
   * @param {number} a - The number to subtract from.
   * @param {number} b - The number to subtract.
   * @returns {number} The result of subtracting `b` from `a`.
   */
  static subtract(a: number, b: number): number {
    return a - b
  }

  /**
   * Multiplies two numbers.
   * @param {number} a - The first number.
   * @param {number} b - The second number.
   * @returns {number} The product of the two numbers.
   */
  static multiply(a: number, b: number): number {
    return a * b
  }

  /**
   * Divides one number by another.
   * @param {number} a - The number to be divided (dividend).
   * @param {number} b - The number by which to divide (divisor).
   * @returns {number} The result of dividing `a` by `b`.
   */
  static divide(a: number, b: number): number {
    return a / b
  }
}

export default Calculator
