import { expect } from 'chai'
import Calculator from '../src/dummy'

describe('Test calculator', () => {
  it('should return sum', () => {
    // act
    const result = Calculator.add(2, 3)

    // assert
    expect(result).to.equal(5)
  })

  it('should return subtract', () => {
    // act
    const result = Calculator.subtract(5, 3)

    // assert
    expect(result).to.equal(2)
  })

  it('should return product', () => {
    // act
    const result = Calculator.multiply(2, 3)

    // assert
    expect(result).to.equal(6)
  })

  it('should return quotient', () => {
    // act
    const result = Calculator.divide(3, 3)

    // assert
    expect(result).to.equal(1)
  })
})
