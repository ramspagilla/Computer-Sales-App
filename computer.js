// @ts-nocheck

const laptopsData = document.getElementById("laptops");
const nameOFTheLaptop = document.getElementById("name");
const priceOfTheLaptop = document.getElementById("price");
const description = document.getElementById("description");
const work = document.getElementById("workPay");
const sendData = document.getElementById("sendPay");
const clearLoan = document.getElementById("hiddenBtn");
const image = document.getElementById("image");
const bankBalanceData = document.getElementById("bankBalance");
const workBalanceData = document.getElementById("workBalance");
const loanBalanceData = document.getElementById("loanBalance");
const loan = document.getElementById("loan");
const hiddenLoan = document.getElementById("hiddenLoan");
const payButton = document.getElementById("buy");
const specifications = document.getElementById("specs");

let desktops = [];
let bankBalance = 0.0;
let workBalance = 0.0;
let loanBalance = 0.0;
let currentPrice;

const API = "https://noroff-komputer-store-api.herokuapp.com/computers";
fetch(API)
  .then((res) => res.json())
  .then((data) => (desktops = data))
  .then((desktops) => addDesktopsToContainer(desktops));

const addDesktopsToContainer = (desktops) => {
  //console.log(desktops)
  desktops.forEach((desktop) => addDesktopToCart(desktop));
  nameOFTheLaptop.textContent = desktops[0].title;
  priceOfTheLaptop.textContent = desktops[0].price;
  image.src =
    "https://noroff-komputer-store-api.herokuapp.com/" + desktops[0].image;
  desktops[0].specs.forEach((spec) => {
    const li = document.createElement("li");
    li.textContent = spec;
    specifications.append(li);
  });
  description.textContent = desktops[0].description;
  //console.log(description.textContent);
};

const addDesktopToCart = (desktop) => {
  //console.log(desktop);
  const laptopData = document.createElement("option");
  laptopData.value = desktop.id;
  laptopData.appendChild(document.createTextNode(desktop.title));
  laptopsData.appendChild(laptopData);
};

const handleLaptopMenuChange = (e) => {
  const selectedLaptop = desktops[e.target.selectedIndex];
  console.log(selectedLaptop);
  priceOfTheLaptop.innerHTML = selectedLaptop.price;
  currentPrice = selectedLaptop.price;
  image.src =
    "https://noroff-komputer-store-api.herokuapp.com/" + selectedLaptop.image;
  specifications.innerHTML = "";
  selectedLaptop.specs.forEach((spec) => {
    const li = document.createElement("li");
    li.innerText = spec;
    specifications.append(li);
  });
  description.innerText = selectedLaptop.description;
  nameOFTheLaptop.innerText = selectedLaptop.title;
};

// The work button must increase your Pay balance by 100 on each click.
const handleAddWork = () => {
  workBalance += 100;
  workBalanceData.innerHTML = workBalance;
};

const sendPay = () => {
  if (loanBalance === 0.0) {
    bankBalance += workBalance;
    bankBalanceData.innerHTML = bankBalance;
  } else {
    bankBalance += workBalance * 0.9;
    bankBalanceData.innerHTML = bankBalance;
    loanBalance -= workBalance * 0.1;
    loanBalanceData.innerHTML = loanBalance;
    if (loanBalance < 0.0) {
      bankBalance = parseInt(bankBalance) + Math.abs(parseInt(loanBalance));
      bankBalanceData.innerHTML = bankBalance;
      loanBalance = 0.0;
      loanBalanceData.innerHTML = 0.0;
    }
  }
  workBalance = 0.0;
  workBalanceData.innerHTML = 0.0;
  resetLoan();
};

const loanApply = () => {
  if (loanBalance === 0.0) {
    const loanAmt = prompt("Enter the amount would you like to loan: ");
    if (
      parseInt(loanAmt) > parseInt(bankBalance * 2) ||
      loanAmt.trim() == 0 ||
      isNaN(loanAmt)
    ) {
      alert("Unfortunately we can not grant the loan that you appled!!! ");
    } else {
      alert("Congratulations.. Loan granted!!");
      loanBalance = loanAmt;
      hiddenLoan.style.visibility = "visible";
      clearLoan.style.visibility = "visible";
      loanBalanceData.innerHTML = loanBalance;
      bankBalance = parseInt(bankBalance) - parseInt(loanBalance);
      bankBalanceData.innerHTML = bankBalance;
    }
  } else {
    alert(
      "Unfortunately we can not grant the loan that you appled!!! Apply after you clear your loan"
    );
  }
};

/* Once you have a loan, a new button should appear. 
Upon clicking thisbutton, the full value of your current Pay
amount should go towards the outstanding loan and NOT your bank account.*/

const repayLoan = () => {
  loanBalance = parseInt(loanBalance) - parseInt(workBalance);
  loanBalanceData.innerHTML = loanBalance;
  if (loanBalance < 0.0) {
    bankBalance = parseInt(bankBalance) + Math.abs(parseInt(loanBalance));
    bankBalanceData.innerHTML = bankBalance;
    loanBalance = 0.0;
    loanBalanceData.innerHTML = 0.0;
  }
  workBalance = 0.0;
  workBalanceData.innerHTML = 0.0;
  resetLoan();
};

const resetLoan = () => {
  if (parseInt(loanBalance) === 0.0) {
    hiddenLoan.style.visibility = "hidden";
    clearLoan.style.visibility = "hidden";
  }
};

/* The buy now button is the final action of your website. This button will attempt to “Buy” a laptop and 
validate whether the bank balance is sufficient to purchase the selected laptop. If you do not have 
enough money in the “Bank”, a message must be shown that you cannot afford the laptop. When you 
have sufficient “Money” in the account, the amount must be deducted from the bank and you must 
receive a message that you are now the owner of the new laptop!
 */

const buyLaptop = () => {
  currentPrice = parseInt(price.innerText);
  bankBalance = parseInt(bankBalance);
  if (currentPrice <= bankBalance) {
    alert("Congratulations!!! You are the owner of this Laptop");
    bankBalance -= currentPrice;
    bankBalanceData.innerHTML = bankBalance;
  } else {
    alert(
      "Unfortunately you can not buy the laptop.... Due to insufficient balance!!!"
    );
  }
};

// Listening to events

laptopsData.addEventListener("change", handleLaptopMenuChange);
work.addEventListener("click", handleAddWork);
sendData.addEventListener("click", sendPay);
loan.addEventListener("click", loanApply);
clearLoan.addEventListener("click", repayLoan);
payButton.addEventListener("click", buyLaptop);
