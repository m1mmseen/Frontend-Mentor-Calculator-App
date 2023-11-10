'use strict'

const themeSwitch = document.getElementById("theme-switcher");
const themes = new Map();

themes.set('1', "default");
themes.set('2', "light");
themes.set('3', "dark-purple");

const theme = localStorage.getItem("selectedTheme") != null ? localStorage.getItem("selectedTheme") : "1";
changeColorTheme(theme);
themeSwitch.value = theme;

themeSwitch.oninput = function () {
    let selectedTheme = themeSwitch.value;
    changeColorTheme(selectedTheme);
    localStorage.setItem("selectedTheme", selectedTheme)
}

function changeColorTheme(selected) {
    let value = themes.get(selected);
    document.body.className = '';
    document.body.classList.add(value);
}

/*     GET EQUITATION FROM INPUT     */

let equitation = '';
let equalsClicked = false;
let equitationScreen = document.getElementById("equitation");


const keys = document.querySelectorAll(".key");
keys.forEach((key) => {
    key.addEventListener("click", (event) => {
        if (equalsClicked) {
            equalsClicked = false;
            equitation = '';
            updateScreen(equitation);
        }
        let pressedKey = key.dataset.value;
        switch (pressedKey) {
            case ("delete"):
                equitation = equitation.slice(0, -1);
                updateScreen(equitation);
                break;
            case ("reset"):
                equitation = "";
                updateScreen(equitation);
                break;
            case ("="):
                equalsClicked = true;
                updateScreen(calculate());
                break;
            default:
                equitation += key.dataset.value.toString()
                updateScreen(equitation);
        }
    })
})


/*   CALCULATOR FUNCTIONS   */
function calculate() {
    const equitationArray = infixToPostFix(equitation);

    let numbers = [];
    let ans = 0;
    equitationArray.forEach(element => {

        if (typeof element === "float" || typeof element === "number") {
            numbers.push(element);

        } else  {
            try {
                const num1 = numbers.pop();
                const num2 = numbers.pop();

                if (element=== "+") {
                    ans = num1 + num2;
                } else if (element=== "-") {
                    ans = num2 - num1;
                } else if (element=== "/") {
                    ans = num2 / num1;
                } else if (element=== "x") {
                    ans = num1 * num2;
                }
                numbers.push(ans);
            } catch{
                return new Error("not possible");
            }

        }
    })
    return (isNaN(ans)) ? "Error": ans;
}

function isOperator(c) {
    return c === "+" || c === "-" || c === "/" || c === "x";
}

function getPrecedence(c) {
    switch (c) {
        case '+' || '-': return 1;
        case '×' || '/': return 2;
    }
}

function infixToPostFix(equitation) {
    let equitationArray = [];
    let stack = [];
    let tempNumber = '';

    for (let i = 0; i < equitation.length; i++) {
        const c = equitation[i];

        if(!isOperator(c)) {
            tempNumber = tempNumber + c;
            if (i === (equitation.length - 1)) {
                equitationArray.push(parseFloat(tempNumber));
            }
        } else if (isOperator(c)) {
            equitationArray.push(parseFloat(tempNumber));
            tempNumber = '';
            while (stack.length > 0 && getPrecedence(c) <= getPrecedence(stack[stack.length - 1])) {
                equitationArray.push(stack.pop());
            }
            stack.push(c);
        }
    }

    while(stack.length > 0) {
        let op = stack.pop();
        equitationArray.push(op);
    }

    return equitationArray;
}

function updateScreen(update) {
    equitationScreen.innerHTML = update;
}