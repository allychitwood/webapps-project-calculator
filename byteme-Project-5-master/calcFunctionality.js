/*

calcFunctionality.js

Authors: Ally Chitwood, Daniel Greer, Carter Brown, Will Greenway, Nathan Simpson

Javascript Calculator

 */


/* Author: Ally Chitwood
Constructors for future output objects.
*/
function Output() {
}

function UserInput() {
}

function InputHistory() {
}

// Creates the hierarchy such that UserInput < Output and InputHistory < Output
UserInput.prototype = new Output();
InputHistory.prototype = new Output();

// Assign functions to the Output object
Output.prototype.setID = function(id, value) {
    // Updates the output element to the new value
    document.getElementById(id).innerHTML = value;
};

Output.prototype.clearAll = function () {
    // Clears all output elements
    this.setID("output", 0);
    this.setID("inputHistory", "<br/>");
};

Output.prototype.userInput = function() {
    // Allows for other objects to obtain the user's input
    return document.getElementById("output").innerHTML;
};

// Assign functions to the UserInput Object
UserInput.prototype.deleteUserInput = function() {
    // Removes the last character of user input
    var newInput = this.userInput().slice(0, -1);
    if (newInput === "") {
        newInput = "0";
    }
    this.setID("output", newInput);
};

UserInput.prototype.clearUserInput = function() {
    // Clears the user input
    this.setID("output", 0);
};

UserInput.prototype.updateUserInput = function() {
    // Updates the overall output to reflect the user's input
    firstNum = Number.parseFloat(this.userInput());
    var inputHistory = new InputHistory();
    inputHistory.updateInputHistory();
    this.clearUserInput();
};

// Assign functions to the InputHistory object
InputHistory.prototype.clearInputHistory = function() {
    // Clears the user's recently input history
    this.setID("inputHistory", "<br/>");
    firstNum = null;
    recentlyComputed = false;
    operation = null;
};

InputHistory.prototype.updateInputHistory = function() {
    // Updates the output to the user's recently input calculation
    this.setID("inputHistory", firstNum + " " + operation);
};

// Create new output objects
var output = new Output();
var userInput = new UserInput();
var inputHistory = new InputHistory();

// Global variables to hold the operation, first number entered, and various flags
var operation = null;
var firstNum = null;
var memory;
var recentlyComputed = false;
var inRadianMode = false;
var storedAnswer = null;
var quickOperation = 0;

/* 
Author: Daniel Greer
Adds event listeners to all buttons upon loading the script. 
*/
// Adds event listeners for all number input buttons and decimal button.
var allInputButtons = document.getElementsByName("inputButtons");
for (let i = 0; i < allInputButtons.length; i++) {
    allInputButtons[i].addEventListener("click", function() { getInput(allInputButtons[i].innerHTML); });
}

// Adds event listeners for all operator buttons.
var allOperatorButtons = document.getElementsByName("operators");
for (let i = 0; i < allOperatorButtons.length; i++) {
    allOperatorButtons[i].addEventListener("click", function() { setOperator(allOperatorButtons[i].innerHTML); });
}

// Adds event listener for equals button.
document.getElementsByName("equals")[0].addEventListener("click", performOperation);

// Adds event listener for lastAnswer button.
document.getElementsByName("lastAnswer")[0].addEventListener("click", getAnswer);

// Adds event listener for all memory functions.
// The for loop doesn't add much since each listener needs a different callback method, but otherwise the eventListeners would have been
// added one by one, meaning there was not point in giving them all the same name.
var allMemoryButtons = document.getElementsByName("memoryOperations");
for (let i = 0; i < allMemoryButtons.length; i++) {
    switch (allMemoryButtons[i].innerHTML) {
        case "MR":
            allMemoryButtons[i].addEventListener("click", recallMem);
            break;
        case "MS":
            allMemoryButtons[i].addEventListener("click", storeMem);
            break;
        case "M+":
            allMemoryButtons[i].addEventListener("click", addMem);
            break;
        case "M-":
            allMemoryButtons[i].addEventListener("click", subtractMem);
            break;
        case "MC":
            allMemoryButtons[i].addEventListener("click", clearMem);
        break;
    }
}

// Adds event listeners for all clear functions.
// The for loop doesn't add much since each listener needs a different callback method, but otherwise the eventListeners would have been
// added one by one, meaning there was not point in giving them all the same name.
var allClearButtons = document.getElementsByName("clearOperations");
for (let i = 0; i < allClearButtons.length; i++) {
    switch (allClearButtons[i].innerHTML) {
        case "C":
            allClearButtons[i].addEventListener("click", clearPushed);
            break;
        case "CE":
            allClearButtons[i].addEventListener("click", function() { userInput.clearUserInput(); });
            break;
		case "DEL":
            allClearButtons[i].addEventListener("click", function() { userInput.deleteUserInput(); });
            break;
	}
}

// Adds event listeners for all trig functions.
// The for loop doesn't add much since each listener needs a different callback method, but otherwise the eventListeners would have been
// added one by one, meaning there was not point in giving them all the same name.
var allTrigButtons = document.getElementsByName("trigFunctions");
for (let i = 0; i < allTrigButtons.length; i++) {
    switch (allTrigButtons[i].innerHTML) {
        case "sin(X)":
            allTrigButtons[i].addEventListener("click", sine);
            break;
        case "cos(X)":
            allTrigButtons[i].addEventListener("click", cosine);
            break;
        case "tan(X)":
            allTrigButtons[i].addEventListener("click", tangent);
            break;
	}
}

// Adds event listeners for all miscellaneous functions.
// The for loop doesn't add much since each listener needs a different callback method, but otherwise the eventListeners would have been
// added one by one, meaning there was not point in giving them all the same name.s
var allMiscFunctions = document.getElementsByName("miscFunctions");
for (let i = 0; i < allMiscFunctions.length; i++) {
    switch (allMiscFunctions[i].innerHTML) {
        case "X^2":
            allMiscFunctions[i].addEventListener("click", square);
            break;
        case "sqrt(X)":
            allMiscFunctions[i].addEventListener("click", squareRoot);
            break;
        case "ln(X)":
            allMiscFunctions[i].addEventListener("click", logarithm);
            break;
        case "+ / -":
            allMiscFunctions[i].addEventListener("click", signChange);
            break;
		case "DEG":
            allMiscFunctions[i].addEventListener("click", radianMode);
            break;
	}
}


/*
Author: Will Greenway
Restores core functionality and answer to initial state.
 */
function clearPushed() {
    output.clearAll();
    clearAnswer();
}
		

/*
Author: Dan Greer
Edited: Carter Brown (10/24/18)
Gets input from the user
@param:
	value: The value of the input from the user
 */
function getInput(value) {
    if (recentlyComputed) {
        output.clearAll();
    }

    if (value === "PI"){
        value = Math.PI;
    }
    recentlyComputed = false;

    updateInput(value, "c");
}

/*
Author: Carter Brown
Adds to or sets the current input to the passed parameter
@param:
	value: The value to add to the current input
@param:
	type: The type of update to be performed.
		"r" indicates to replace the current input with the passed value
		"c" indicates to concatenate the current input with the passed value
 */
function updateInput(value, type) {
    switch (type) {
        case "r":
            // Replace the current input
            output.setID("output", value);
            break;
        case "c":

            // Concatenate to the current input
            let currentNum = output.userInput();
            if (currentNum === "0") {
                currentNum = value;
            } else {
                currentNum += value;
            }
            output.setID("output", currentNum);
            break;
        default:
            window.alert("ERROR: updateInput called incorrectly; type parameter invalid");
    }
}

/*
Author: Will Greenway
Retrieves stored answer and places it in function line.
 */
function getAnswer() {
    if(storedAnswer == null){
        window.alert("ERROR: No answer stored.");
    } else {
        if(recentlyComputed){
            output.clearAll();
        }
        updateInput(storedAnswer,'r');
    }
}

/*
Author: Will Greenway
Stores and displays answer value
@param:
	value: the number to be stored as storedAnswer.
 */
function updateAnswer(value) {
    storedAnswer = value;
    output.setID("lastAnswer", "Ans= " + value);
}

/*
Author: Will Greenway
Clears stored answer and stops displaying it.
 */
function clearAnswer() {
    storedAnswer = null;
    output.setID("lastAnswer", "<br/>");
}

/* Author: Daniel Greer
Edited: Will Greenway (10/28/2018)
Sets the operator to whatever button the user pushed
@param:
	value: the string value of the button pushed
*/
function setOperator(value) {

    // Allows for repeated pressing of an operation
    quickOperation++;
    if(quickOperation > 1){
        performOperation(false);
    }

    // Sets the operation
    operation = value;
    recentlyComputed = false;
    userInput.updateUserInput();
}


/*
Author: Carter Brown
Clears number in memory when MC button is clicked
 */
function clearMem() {
    memory = 0;
}

/*
Author: Carter Brown
Replaces current input with the value in memory
 */
function recallMem() {
    updateInput(memory, "r");
}

/*
Author: Carter Brown
Stores the current input in memory
 */
function storeMem() {
    let currentInput = output.userInput();
    if(checkInput()) {
        memory = currentInput;
    } else {
        window.alert("ERROR: Cannot store current input in memory: May not be a number");
    }
}

/*
Author: Carter Brown
Adds the current input to the value in memory
 */
function addMem() {
    let currentInput = output.userInput();
    if(checkInput()) {
        memory = Number.parseFloat(memory) + Number.parseFloat(currentInput);
    } else {
        window.alert("ERROR: Cannot add current input to memory: May not be a number");
    }
}

/*
Author: Carter Brown
Subtracts the current input from the value in memory
*/
function subtractMem() {
    let currentInput = output.userInput();
    if(checkInput()) {
        memory = Number.parseFloat(memory) - Number.parseFloat(currentInput);
    } else {
        window.alert("ERROR: Cannot subtract current input to memory: May not be a number");
    }
}

/*
Author: Nathan Simpson
Calculates the square root of the input
*/
function squareRoot() {
    let input = Number.parseFloat(output.userInput());
    let finalAnswer = Math.sqrt(input);
    updateAnswer(finalAnswer);
    updateInput(finalAnswer, "r");
    recentlyComputed = true;
}

/*Author: Nathan Simpson
Calculates the sine of the input. Input must be in degrees
*/
function sine() {
    let input = Number.parseFloat(output.userInput());
    let finalAnswer = 0;

    // Calculates based on if calculator is in radians or degrees mode
    if (inRadianMode) {
        finalAnswer = Math.sin(input);
    } else {
        finalAnswer = Math.sin(input * Math.PI/180);
    }

    // Updates the user's input
    updateAnswer(finalAnswer);
    updateInput(finalAnswer, "r");
    recentlyComputed = true;
	
}

/*Author: Nathan Simpson
Calculates the sine of the input. Input must be in degrees
*/
function cosine() {
    let input = Number.parseFloat(output.userInput());
    let finalAnswer = 0;

    // Calculates based on if calculator is in radians or degrees mode
    if (inRadianMode) {
        finalAnswer = Math.cos(input);
    } else {
        finalAnswer = Math.cos(input * Math.PI/180);
    }

    // Updates the user's input
    updateAnswer(finalAnswer);
    updateInput(finalAnswer, "r");
    recentlyComputed = true;
}

/*Author: Nathan Simpson
Calculates the sine of the input. Input must be in degrees
*/
function tangent() {
    let input = Number.parseFloat(output.userInput());
    let finalAnswer = 0;

    // Calculates based on if calculator is in radians or degrees mode
    if (inRadianMode) {
        finalAnswer = Math.tan(input);
    } else {
        finalAnswer = Math.tan(input * Math.PI/180);
    }

    // Updates the user's input
    updateAnswer(finalAnswer);
    updateInput(finalAnswer, "r");
    recentlyComputed = true;
}

/*Author: Nathan Simpson
Calculates the square of the input
*/
function square() {
    let input = Number.parseFloat(output.userInput());
    let finalAnswer = Math.pow(input, 2);
    updateAnswer(finalAnswer);
    updateInput(finalAnswer, "r");
    recentlyComputed = true;
}

/*Author: Nathan Simpson
Calculates the logarithm base e of the input
*/
function logarithm() {
    let input = Number.parseFloat(output.userInput());
    let finalAnswer = Math.log(input);
    updateAnswer(finalAnswer);
    updateInput(finalAnswer, "r");
    recentlyComputed = true;
}

/*Author: Nathan Simpson
Changes the sign value of the input number
*/
function signChange() {
    let input = Number.parseFloat(output.userInput());
    let finalAnswer = input * -1;
    updateInput(finalAnswer, "r");
}

/*Author: Nathan Simpson
Changes the calculator mode between degrees and radians for trig functions
*/
function radianMode() {
    inRadianMode = !inRadianMode;

    // Updates the RAD button to show user if the calculator is in degree or radian mode
    if(inRadianMode) {
        output.setID("radButton", "RAD");
    } else {
        output.setID("radButton", "DEG");
    }
}

/*
Author: Carter Brown
Checks the current input and returns a boolean indicating if it is a valid number
Returns boolean
 */
function checkInput() {
    let currentInput = output.userInput();
    let numericalString = /^-?([0-9]*[.])?[0-9]+$/;
    return numericalString.test(currentInput);
}


/* Author: Daniel Greer
Edited by Ally Chitwood on 10/28, Will Greenway on 10/30
Performs the basic operation selected by the user.
*/
function performOperation(storeAns = true) {

    if (storeAns) {
        quickOperation = 0;
    }
    let finalAnswer = 0;

    // If the first number is nonexistentt, then the answer is the user's input
    if(firstNum == null){
        finalAnswer = Number.parseFloat(output.userInput());
    } else {

        // Perform the user's specified calculation
        let secondNum = Number.parseFloat(output.userInput());
        switch(operation) {
            case "+":
                finalAnswer = firstNum + secondNum;
                break;
            case "-":
                finalAnswer = firstNum - secondNum;
                break;
            case "*":
                finalAnswer = firstNum * secondNum;
                break;
            case "/":
                if (secondNum !== 0) {
                    finalAnswer = firstNum / secondNum;
                } else {
                    window.alert("ERROR: Cannot divide by 0");
                    clearAnswer();
                    storeAns = false;
                }
                break;
            case "^":
                finalAnswer = Math.pow(firstNum, secondNum);
                break;
            default:
                window.alert("ERROR: Invalid operation");
                finalAnswer = firstNum;
                clearAnswer();
                storeAns = false;
        }
    }

    // If the answer is to be stored, store it
    if (storeAns) {
        updateAnswer(finalAnswer);
    }

    // Update the output to the user
    updateInput(finalAnswer, "r");
    inputHistory.clearInputHistory();
    recentlyComputed = true;
}

