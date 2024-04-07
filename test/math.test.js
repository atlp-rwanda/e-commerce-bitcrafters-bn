"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const math_1 = require("../src/math");
describe("Testing Index", () => {
    it("should return 10 when have 8 + 2", () => {
        (0, chai_1.expect)((0, math_1.sum)(8, 2)).to.equal(10);
    });
    it("Should return the 6 when we have 8 - 2", () => {
        (0, chai_1.expect)((0, math_1.sub)(8, 2)).to.equal(6);
    });
    it("should return 16 when we have 8 * 2", () => {
        (0, chai_1.expect)((0, math_1.multiply)(8, 2)).to.equal(16);
    });
    it("Should return 4 when we have 8 / 2", () => {
        (0, chai_1.expect)((0, math_1.div)(8, 2)).to.equal(4);
    });
});
