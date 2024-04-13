"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const calculator_1 = __importDefault(require("../src/calculator"));
describe("Test calculator", () => {
    it("should return sum", () => {
        //arrange
        const calc = new calculator_1.default();
        // act
        const result = calc.add(2, 3);
        //assert
        (0, chai_1.expect)(result).to.equal(5);
    });
});
//# sourceMappingURL=calculator.spec.js.map