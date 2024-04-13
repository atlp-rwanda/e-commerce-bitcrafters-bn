class Calculator{
    add(a:number, b:number): number{
        return a+b;
    }
    substract(a:number, b:number): number{
        return a-b;
    }
    multiply(a:number, b:number): number{
        return a*b;
    }
    divide(a:number, b:number): number{
        if(b===0){
            throw new Error("can't divide by 0")
        }
        return a/b;
    }
}
export default Calculator
