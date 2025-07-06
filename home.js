var invbool = true;
var radbool = true;
const PI = 3.14159265358979323846264338327950288419716939937510;
const E = 2.71828182845904523536028747135266249775724709369995;

function factorial(n){
    if(n<0 || !Number.isInteger(n)) return undefined;
    let f = 1;
    for(let i=2; i<=n; i++){
        f *= i;
    }
    return f;
}

function priority(operator){
    switch(operator){
        case "+":
        case "−":
            return 1;

        case "×":
        case "÷":
            return 2;
            
        case "^":
            return 3;
            
        case "!":
        case "s":
        case "c":
        case "t":
        case "S":
        case "C":
        case "T":
        case "l":
        case "L":
            return 4;
    }
}

function parse(expr){
    // if(expr=="INFINITY") return "1÷0";
    // if(expr=="-INFINITY") return "−1÷0";
    expr = expr.replaceAll("²", "^2");
    expr = expr.replaceAll("%", "÷100");

    while(true){
        newexpr = "";
        let inside = false;
        let flag = true;
        let depth = 0;
        let operator = undefined;
        for(let i=0; i<expr.length; i++){
            if(inside){
                newexpr += expr.charAt(i);
                if(expr.charAt(i)=="("){
                    depth++;
                }
                else if(expr.charAt(i)==")"){
                    depth--;
                    if(depth == 0){
                        newexpr += operator;
                        inside = false;
                    }
                }
            }
            else if(expr.slice(i, i+2) == "√("){
                inside = true;
                depth = 1;
                newexpr += "(";
                i+=1;
                flag = false;
                operator = "^0.5";
            }
            else if(expr.slice(i, i+4) == "sin("){
                inside = true;
                depth = 1;
                newexpr += "(";
                i+=3;
                flag = false;
                operator = "s"
            }
            else if(expr.slice(i, i+4) == "cos("){
                inside = true;
                depth = 1;
                newexpr += "(";
                i+=3;
                flag = false;
                operator = "c"
            }
            else if(expr.slice(i, i+4) == "tan("){
                inside = true;
                depth = 1;
                newexpr += "(";
                i+=3;
                flag = false;
                operator = "t"
            }
            else if(expr.slice(i, i+4) == "log("){
                inside = true;
                depth = 1;
                newexpr += "(";
                i+=3;
                flag = false;
                operator = "l"
            }
            else if(expr.slice(i, i+3) == "ln("){
                inside = true;
                depth = 1;
                newexpr += "(";
                i+=2;
                flag = false;
                operator = "L"
            }
            else if(expr.slice(i, i+6) == "sin⁻¹("){
                inside = true;
                depth = 1;
                newexpr += "(";
                i+=5;
                flag = false;
                operator = "S"
            }
            else if(expr.slice(i, i+6) == "cos⁻¹("){
                inside = true;
                depth = 1;
                newexpr += "(";
                i+=5;
                flag = false;
                operator = "C"
            }
            else if(expr.slice(i, i+6) == "tan⁻¹("){
                inside = true;
                depth = 1;
                newexpr += "(";
                i+=5;
                flag = false;
                operator = "T"
            }
            else{
                newexpr += expr.charAt(i);
            }
        }
        if(inside)
            newexpr += ")" + operator;
        if(flag) break;
        expr = newexpr;
    }
    
    for(let i=1; i<expr.length; i++){
        if((expr.charAt(i)=="(" || expr.charAt(i)=="π" || expr.charAt(i)=="e") && (expr.charAt(i-1)=="0" || expr.charAt(i-1)=="1" || expr.charAt(i-1)=="2" || expr.charAt(i-1)=="3" || expr.charAt(i-1)=="4" || expr.charAt(i-1)=="5" || expr.charAt(i-1)=="6" || expr.charAt(i-1)=="7" || expr.charAt(i-1)=="8" || expr.charAt(i-1)=="9" || expr.charAt(i-1)=="π" || expr.charAt(i-1)=="e" || expr.charAt(i-1)==")")){
            expr = expr.slice(0, i) + "×" + expr.slice(i);
        }
        if((expr.charAt(i)=="(" || expr.charAt(i)=="π" || expr.charAt(i)=="e") && (expr.charAt(i-1)==".")){
            return undefined;
        }
    }
    
    expr = expr.replaceAll("π", String(PI));
    expr = expr.replaceAll("e", String(E));
    
    for(let i=0; i<expr.length; i++){
        if(expr.charAt(i)=="E"){
            let j=i+1;
            if(expr.charAt(j)=="−") j++;
            for(; j<expr.length; j++){
                if(!(expr.charAt(j)=="0" || expr.charAt(j)=="1" || expr.charAt(j)=="2" || expr.charAt(j)=="3" || expr.charAt(j)=="4" || expr.charAt(j)=="5" || expr.charAt(j)=="6" || expr.charAt(j)=="7" || expr.charAt(j)=="8" || expr.charAt(j)=="9"))
                    break;
            }
            expr = expr.slice(0, i) + "×10^(" + expr.slice(i+1, j) + ")" + expr.slice(j);
        }
    }
    
    for(let i=0; i<expr.length; i++){
        if(expr.charAt(i)=="−" && (i==0 || expr.charAt(i-1)=="(")){
            expr = expr.slice(0, i) + "0" + expr.slice(i);
        }
    }

    return expr;
}

function calculate(expr){
    if(expr == undefined || expr == NaN || expr.length == 0)
        return undefined;
    
    if(!isNaN(expr))
        return Number(expr);
    
    let operands = [];
    let operators = [];

    let operand = "";
    let insidebracket = false;
    let depth = 0;
    for(let i=0; i<expr.length; i++){
        if(insidebracket){
            if(expr.charAt(i)=="("){
                operand += expr.charAt(i);
                depth++;
            }
            else if(expr.charAt(i)==")"){
                depth--;
                if(depth == 0){
                    insidebracket = false;
                }
                else{
                    operand += expr.charAt(i);
                }
            }
            else
                operand += expr.charAt(i);
        }
        else{
            if(expr.charAt(i)==")"){
                return NaN;
            } 
            else if(expr.charAt(i)=="("){
                insidebracket = true;
                depth = 1;
            }
            else if(expr.charAt(i)=="+" || expr.charAt(i)=="−" || expr.charAt(i)=="×" || expr.charAt(i)=="÷" || expr.charAt(i)=="^" || expr.charAt(i)=="s" || expr.charAt(i)=="c" || expr.charAt(i)=="t" || expr.charAt(i)=="l" || expr.charAt(i)=="L" || expr.charAt(i)=="S" || expr.charAt(i)=="C" || expr.charAt(i)=="T" || expr.charAt(i)=="!"){
                if(operand.length>0) operands.push(operand);
                operand = "";
                while(operators.length!=0 && priority(expr.charAt(i)) <= priority(operators[operators.length-1])){
                    let op2 = operands.pop();
                    let op = operators.pop();
                    if(op == "+"){
                        let op1 = operands.pop();
                        operands.push(calculate(op1) + calculate(op2));
                    }
                    else if(op == "−"){
                        let op1 = operands.pop();
                        operands.push(calculate(op1) - calculate(op2));
                    }
                    else if(op == "×"){
                        let op1 = operands.pop();
                        operands.push(calculate(op1) * calculate(op2));
                    }
                    else if(op == "÷"){
                        let op1 = operands.pop();
                        operands.push(calculate(op1) / calculate(op2));
                    }
                    else if(op == "^"){
                        let op1 = operands.pop();
                        operands.push(calculate(op1) ** calculate(op2));
                    }
                    else if(op == "s") operands.push(Math.sin(calculate(op2)));
                    else if(op == "c") operands.push(Math.cos(calculate(op2)));
                    else if(op == "t") operands.push(Math.tan(calculate(op2)));
                    else if(op == "S") operands.push(Math.asin(calculate(op2)));
                    else if(op == "C") operands.push(Math.acos(calculate(op2)));
                    else if(op == "T") operands.push(Math.atan(calculate(op2)));
                    else if(op == "l") operands.push(Math.log10(calculate(op2)));
                    else if(op == "L") operands.push(Math.log(calculate(op2)));
                    else if(op == "!")operands.push(factorial(calculate(op2)));
                }
                operators.push(expr.charAt(i));
            }
            else{
                operand += expr.charAt(i);
            }
        }
    }

    if(operand.length>0) operands.push(operand);
    
    while(operators.length!=0){
        let op2 = operands.pop();
        let op = operators.pop();
        if(op == "+"){
            let op1 = operands.pop();
            operands.push(calculate(op1) + calculate(op2));
        }
        else if(op == "−"){
            let op1 = operands.pop();
            operands.push(calculate(op1) - calculate(op2));
        }
        else if(op == "×"){
            let op1 = operands.pop();
            operands.push(calculate(op1) * calculate(op2));
        }
        else if(op == "÷"){
            let op1 = operands.pop();
            operands.push(calculate(op1) / calculate(op2));
        }
        else if(op == "^"){
            let op1 = operands.pop();
            operands.push(calculate(op1) ** calculate(op2));
        }
        else if(op == "s") operands.push(Math.sin(calculate(op2) * (radbool? 1: (PI/180))));
        else if(op == "c") operands.push(Math.cos(calculate(op2) * (radbool? 1: (PI/180))));
        else if(op == "t") operands.push(Math.tan(calculate(op2) * (radbool? 1: (PI/180))));
        else if(op == "S") operands.push(Math.asin(calculate(op2)) * (radbool? 1: (180/PI)));
        else if(op == "C") operands.push(Math.acos(calculate(op2)) * (radbool? 1: (180/PI)));
        else if(op == "T") operands.push(Math.atan(calculate(op2)) * (radbool? 1: (180/PI)));
        else if(op == "l") operands.push(Math.log10(calculate(op2)));
        else if(op == "L") operands.push(Math.log(calculate(op2)));
        else if(op == "!") operands.push(factorial(calculate(op2)));
    }

    if(operands[0] == undefined) return undefined;
    let count = 0;
    for(let i=0; i<operands[0].length; i++){
        if(operands[0].charAt(i)=="(")
            break;
        else if(operands[0].charAt(i)=="."){
            count++;
            if(count>1) return undefined;
        }
    }
    return Math.round(operands[0]*1e10)/1e10;
}

let items = document.getElementsByClassName("calculate");
for(i=0; i<items.length; i++){
    let o = items[i];
    o.addEventListener("click", () => {
        setTimeout(() => {
            let expr = document.querySelector("#expr");
            let res = document.querySelector("#res");
            res.innerText = calculate(parse(expr.innerText));
            if(res.innerText == "undefined" || res.innerText == "NaN") res.innerText = "";
            res.innerText = (res.innerText).replaceAll("e", "E");
        }, 1);
    });
}

items = document.getElementsByClassName("direct");
for(i=0; i<items.length; i++){
    let o = items[i];
    o.addEventListener("click", () => {
        let expr = document.querySelector("#expr");
        if(expr.innerText == "Syntax error" || expr.innerText == "INFINITY" || expr.innerText == "-INFINITY") expr.innerText = "";
        expr.innerText = expr.innerText + o.innerText;
    });
}

items = document.getElementsByClassName("bracket");
for(i=0; i<items.length; i++){
    let o = items[i];
    o.addEventListener("click", () => {
        let expr = document.querySelector("#expr");
        if(expr.innerText == "Syntax error" || expr.innerText == "INFINITY" || expr.innerText == "-INFINITY") expr.innerText = "";
        expr.innerText = expr.innerText + o.innerText + "(";
    });
}

items = document.getElementsByClassName("special");
for(let i=0; i<items.length; i++){
    let o = items[i];
    o.addEventListener("click", () => {
        let expr = document.querySelector("#expr");
        if(expr.innerText == "Syntax error" || expr.innerText == "INFINITY" || expr.innerText == "-INFINITY") expr.innerText = "";
        if(invbool)
            expr.innerText = expr.innerText + o.innerText + "(";
        else
            expr.innerText = expr.innerText + o.innerText;
    });
}

let bksp = document.querySelector("#bksp");
bksp.addEventListener("click", () => {
    let expr = document.querySelector("#expr");
    let txt = expr.innerText;
    if(txt.slice(-4)=="sin(")
        expr.innerText = txt.slice(0, -4);
    else if(txt.slice(-4)=="cos(")
        expr.innerText = txt.slice(0, -4);
    else if(txt.slice(-4)=="tan(")
        expr.innerText = txt.slice(0, -4);
    else if(txt.slice(-4)=="log(")
        expr.innerText = txt.slice(0, -4);
    else if(txt.slice(-3)=="ln(")
        expr.innerText = txt.slice(0, -3);
    else if(txt.slice(-6)=="sin⁻¹(")
        expr.innerText = txt.slice(0, -6);
    else if(txt.slice(-6)=="cos⁻¹(")
        expr.innerText = txt.slice(0, -6);
    else if(txt.slice(-6)=="tan⁻¹(")
        expr.innerText = txt.slice(0, -6);
    else if(txt.slice(-2)=="√(")
        expr.innerText = txt.slice(0, -2);
    else if(txt=="Syntax error" || txt=="INFINITY" || txt=="-INFINITY")
        expr.innerText = "";
    else
        expr.innerText = expr.innerText.slice(0, -1);
});

let clear = document.querySelector("#clear");
clear.addEventListener("click", () => {
    let expr = document.querySelector("#expr");
    expr.innerText = "";
});

let inv = document.querySelector("#inv");
inv.addEventListener("click", () => {
    if(invbool){
        invbool = false;
        inv.style.color = "rgb(93, 144, 255)";
        inv.style.borderColor = "rgb(93, 144, 255)";
        let sin = document.querySelector("#sin");
        sin.innerHTML = "sin⁻¹";
        let cos = document.querySelector("#cos");
        cos.innerHTML = "cos⁻¹";
        let tan = document.querySelector("#tan");
        tan.innerHTML = "tan⁻¹";
        let log = document.querySelector("#log");
        log.innerHTML = "10^";
        let ln = document.querySelector("#ln");
        ln.innerHTML = "e^";
        let sqrt = document.querySelector("#sqrt");
        sqrt.innerHTML = "²";
    }
    else{
        invbool = true;
        inv.style.color = "rgb(255, 255, 255)";
        inv.style.borderColor = "rgb(30, 30, 30)";
        let sin = document.querySelector("#sin");
        sin.innerText = "sin";
        let cos = document.querySelector("#cos");
        cos.innerHTML = "cos";
        let tan = document.querySelector("#tan");
        tan.innerHTML = "tan";
        let log = document.querySelector("#log");
        log.innerHTML = "log";
        let ln = document.querySelector("#ln");
        ln.innerHTML = "ln";
        let sqrt = document.querySelector("#sqrt");
        sqrt.innerHTML = "&Sqrt;";
    }
});


let rad = document.querySelector("#rad");
let deg = document.querySelector("#deg");

rad.addEventListener("click", () => {
    if(!radbool){
        radbool = true;
        rad.style.color = "rgb(93, 144, 255)";
        rad.style.borderColor = "rgb(93, 144, 255)";
        deg.style.color = "rgb(255, 255, 255)";
        deg.style.borderColor = "rgb(30, 30, 30)";
    }
});

deg.addEventListener("click", () => {
    if(radbool){
        radbool = false;
        deg.style.color = "rgb(93, 144, 255)";
        deg.style.borderColor = "rgb(93, 144, 255)";
        rad.style.color = "rgb(255, 255, 255)";
        rad.style.borderColor = "rgb(30, 30, 30)";
    }
});

equals = document.querySelector("#equals");
equals.addEventListener("click", () => {
    let expr = document.querySelector("#expr");
    let res = document.querySelector("#res");
    if(res.innerText.length == 0){
        expr.innerText = calculate(parse(expr.innerText));
        if(expr.innerText == "undefined" || expr.innerText == "NaN") expr.innerText = "Syntax error";
        else expr.innerText = res.innerText.toUpperCase();
    }
    else if(res.innerText == "NaN")
        expr.innerText = "Syntax error";
    else
        expr.innerText = res.innerText.toUpperCase();
    res.innerText = "";
});