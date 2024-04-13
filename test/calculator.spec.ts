import { expect } from 'chai';
import Calculator from '../src/calculator'

describe("Test calculator", () => {
    it("should return sum", ()=>{
        //arrange
        const calc = new Calculator();

        // act
        const result = calc.add(2,3);

        //assert
        expect(result).to.equal(5);
    })
})
