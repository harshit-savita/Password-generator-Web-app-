const inputSlider = document.querySelector("[data-lengthSlider]"); // searching element by custom attribute. Name of custom shoulde inside sqaure  brackets[]
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyMsg = document.querySelector("[data-copyMsg]");
const indicator = document.querySelector("[data-indicator]");
const copyBtn = document.querySelector("[data-copy]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '(){}[]<>,.?/;:"`~!@#$%^&*-_|';

let password = "";
let passwordLength = 10;
let checkCount = 0; 

handleSlider();

//set strength color intially to grey
setIndicator('#ccc');

// set password length 
// (ye function password length ko ui pr show karta hai )
function handleSlider() {
    inputSlider.value = passwordLength; //setting intial position/value of slider
    lengthDisplay.innerText = passwordLength //setting intial length of password

    const max=inputSlider.max;
    const min=inputSlider.min;
    console.log(max);
    console.log(min);

    inputSlider.style.backgroundSize=((passwordLength-min)*100/(max-min))+"% 100%";
}

function setIndicator(color) {
    //shadow
    indicator.setAttribute(`style`,` background-color:${color};box-shadow:0px 0px 8px ${color}`);
}
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
    return getRndInteger(0, 9);
}

function generateUppercase() {
    return String.fromCharCode(getRndInteger(65, 91));
}

function generateLowercase() {
    return String.fromCharCode(getRndInteger(97, 123));
}

function generateSymbol() {
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

// password shuffle 
function shufflepassword(array) {
    // fisher yates method 
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => str += el);

    return str;
}

// password strength calculator 
function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0");
    }
    else if ((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6) {
        setIndicator("#ff0");
    }
    else {
        setIndicator("red");
    }

}

// copying on Clipboard
async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    }
    catch (e) {
        copyMsg.innerText = "Failed";
    }

    // to make copy wala span visible
    copyMsg.classList.add("active")

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);

}

//adding evetlistner on slider 
//jab user slide krega toh slider ki position se value nikal akr passwordLength mai update kar denge 
inputSlider.addEventListener('input', (slider) => {
    passwordLength = slider.target.value;
    handleSlider();
});

//adding evetlistner on copybutton
//agar password display karne wali field empty nhi hai toh copyContent() call kr lo  
copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value)
        copyContent();
});

//Atleast 1 checkbox should be checked to generate password
// we need to count how many check boxes are ticked and for that we have to add event listener to check boxes
// jab bhi koi check box tick ya un tick hoga ye function call hoga aur check krega kitne checkbox checked 
// har batr checkcount zero se intialise hoga tak count kr sake kitne checkbox checked hai
function handleCheckBoxChange() {
    checkCount = 0;

    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked)
            checkCount++;
    });

    // minimum length password ki utni honi chaiye jitne check box tick hai 
    // example 4 checkbox tick hai aur user ne password length 1 dali hai toh minimum 4 ka hee generate hoga pass 
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}
//adding event listener on all check box using loop
allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
});

// generating random password 
generateBtn.addEventListener('click', () => {
    // none of the check box is selected 
    if (checkCount <= 0)
        return;
    
    // if user selects length less than no of check box then update password length on ui after passworrd generation
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    // remove old password 
    password = "";

    // pushing functions in array on basis of check boxes ticked
    let funcArr = [];

    if (uppercaseCheck.checked)
        funcArr.push(generateUppercase);

    if (lowercaseCheck.checked)
        funcArr.push(generateLowercase);

    if (numbersCheck.checked)
        funcArr.push(generateRandomNumber);

    if (symbolsCheck.checked)
        funcArr.push(generateSymbol);

    // compulsary addition     
    // calling each function at least once so that we fulfill condition of checkboxes that are ticked 
    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }

    // remaning addition 
    // if pass length is greater than check box selcted then after compulsarly calling function for each check box selected
    // now calling function randomly to generate remaning charcters of password
    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        let ranIndex = getRndInteger(0, funcArr.length);
        password += funcArr[ranIndex]();
    }

    // shuffling password 
    password = shufflepassword(Array.from(password));
    
    // showing on UI 
    passwordDisplay.value = password;

    // called for displaying strength 
    calcStrength();
});