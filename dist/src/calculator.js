"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Calculator {
    add(a, b) {
        return a + b;
    }
    substract(a, b) {
        return a - b;
    }
    multiply(a, b) {
        return a * b;
    }
    divide(a, b) {
        if (b === 0) {
            throw new Error("can't divide by 0");
        }
        return a / b;
    }
}
exports.default = Calculator;
//# sourceMappingURL=calculator.js.map