'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Ahmed Heaba',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

//DISPLAY MOVMENTS ON THE SCREEN.
const displayMovments = function (acc, sort = false) {
  containerMovements.textContent = '';
  const movs = sort
    ? acc.movements.slice().sort((firstEL, secondEL) => firstEL - secondEL)
    : acc.movements;
  movs.forEach(function (movement, index) {
    const type = movement > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[index]);
    const years = date.getFullYear();
    const months = `${date.getMonth() + 1}`.padStart(2, 0);
    const days = `${date.getDate()}`.padStart(2, 0);
    const displayDate = `${days}/${months}/${years}`;

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      index + 1
    } ${type} </div>
      <div class="movements__date">${displayDate}</div>
      <div class="movements__value">${movement.toFixed(2)}€</div>
  </div>
`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  const balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  acc.balance = balance;
  labelBalance.textContent = `${acc.balance.toFixed(2)}EUR`;
};

const computeUsername = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
computeUsername(accounts);

const chaning = function (acco) {
  const incomes = acco.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes.toFixed(2)}€`;

  const outcomes = acco.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(outcomes).toFixed(2)}€`;
  const intested = acco.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * acco.interestRate) / 100)
    .filter(int => int > 1)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = `${intested.toFixed(2)}€`;
};
const displayUI = function (acc) {
  //Display Movments.
  displayMovments(acc);

  //Display Balance.
  calcDisplayBalance(acc);

  //Display Sammry.
  chaning(acc);
};

const now = new Date();
const year = now.getFullYear();
const month = `${now.getMonth() + 1}`.padStart(2, 0);
const day = `${now.getDate()}`.padStart(2, 0);
const hours = now.getHours();
const min = now.getMinutes();
labelDate.textContent = `${day}/${month}/${year}, ${hours}:${min}`;

//IMPLEMENT LOGIN.
let currentAccount;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);
  if (+inputLoginPin.value === currentAccount?.pin) {
    //Display UI and Welcome Message.
    labelWelcome.textContent = `Welcome Back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    inputLoginUsername.value = inputLoginPin.value = '';

    inputLoginPin.blur();

    displayUI(currentAccount);
  }
});

//TRANSFER MONEY.
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const transferTo = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  if (
    amount > 0 &&
    transferTo &&
    currentAccount.balance >= amount &&
    transferTo?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    transferTo.movements.push(amount);
    displayUI(currentAccount);
  }
  inputTransferAmount.value = inputTransferTo.value = '';
});

//CLOSE ACCOUNT.
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +Math.trunc(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(acc => acc > amount / 10)) {
    currentAccount.movements.push(amount);
    displayUI(currentAccount);
    inputLoanAmount.value = '';
  }
});

let sorted = false;
console.log(sorted);
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovments(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
// // console.log(Math.trunc(Math.random() * 6) + 1);

// // const randomNum = (min, max) => Math.trunc(Math.random() * (max - min));
// // console.log(randomNum(100, 200));

// // console.log(Math.round(23.2));
// // console.log(Math.round(23.26626));
// // console.log(Math.round(23.2));
// // console.log(Math.round(23.2));
// // console.log(Math.round(23.2));

/*
console.log(2 ** 53 - 1);
console.log(Number.MAX_SAFE_INTEGER);
console.log(BigInt(202020205343554685));
console.log(202020205343554685n);

const huge = BigInt(202020205343554685);
const huge2 = 202020205343554685n;

console.log(huge === huge2);

const x = 101225458455211485n;
const y = 20;
console.log(x * BigInt(y));
*/
/*
const now = new Date();
console.log(now);

console.log(new Date('Aug 02 2021 18:05:20'));
console.log(new Date('December 24, 2015'));
console.log(new Date(0));
console.log(new Date(3 * 24 * 60 * 60 * 1000));
*/
const fuature = new Date(2030, 10, 20, 15, 26, 19);
console.log(fuature);
console.log(fuature.getFullYear());
console.log(fuature.getMonth());
console.log(fuature.getDay());
console.log(fuature.getHours());
console.log(fuature.toISOString());
