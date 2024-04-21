import { expect } from 'chai';
import Calculator from '../src/dummy'

describe("Test calculator", () => {
    it("should return sum", ()=>{
        //arrange
        const calc = new Calculator();

        // act
        const result = calc.add(2,3);

        //assert
        expect(result).to.equal(5);
    })
    it("should return subtract", ()=>{
        //arrange
        const calc = new Calculator();

        // act
        const result = calc.substract(5,3);

        //assert
        expect(result).to.equal(2);
    })
    it("should return product", ()=>{
        //arrange
        const calc = new Calculator();

        // act
        const result = calc.multiply(2,3);

        //assert
        expect(result).to.equal(6);
    })
    it("should return quotient", ()=>{
        //arrange
        const calc = new Calculator();

        // act
        const result = calc.divide(3,3);

        //assert
        expect(result).to.equal(1);
    })
})
