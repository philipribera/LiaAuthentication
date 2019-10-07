/***************************************/
/*** SCRIPT STOCKZOOM AUTHENTICATION ***/
/*** AUTHOR: Philip R                ***/
/***************************************/

// we validate user input
const validateUserLogin = e => {
  e.preventDefault();
  let userEmail = e.target.querySelector("#email").value;
  let userPassword = e.target.querySelector("#password").value;  
  const data = {
    email: userEmail,
    password: userPassword
  };
  sendUserData(data);
};

// if validated we make a POST request for authentication
const sendUserData = async data => {
  const loginMessage = document.querySelector(".login-message");
  console.log("Login in progress...");

  let options = {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      Authorization: ""
    },
    body: JSON.stringify(data)
  };
  try {
    const response = await fetch(
      "https://beta.stockzoom.com/api-token-auth/",
      options
    );
    if (response.ok) {
      let jsonData = await response.json();
      options.headers.Authorization = `BEARER ${jsonData.token}`;
      let token = jsonData.token;
      loginMessage.innerText = "Login in progress...";
      console.clear();
      getPortfolio(token, jsonData);
    } else {
      console.log("Login failed.");
      loginMessage.innerText = "Authentication failed.";
      let error = new Error(response.statusText);
      error.response = response;
    }
  } catch (error) {
    console.error();
  }
  // second release...
  // verifyToken(jsonData.token);
};

// IF CREDENTIALS ARE AUTHENTICATED
const getPortfolio = async (token) => {
  let options = {
    method: "GET",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      Authorization: `BEARER ${token}`
    }
  };
  response = await fetch(
    "https://beta.stockzoom.com/api/v1/me/portfolios/",
    options
  );
  let jsonData = await response.json();
  selectedPortfolio(jsonData);
};

// DISPLAY ACCOUNT FIELDS
const selectedPortfolio = data => {
  const userLogin = document.querySelector(".user-login");
  const portFolioHidden = document.querySelector(".portfolio-hidden");
  portFolioHidden.classList.remove("portfolio-hidden");
  userLogin.classList.add("login-hidden");
  var portFolioList = document.querySelector(".portfolio-list");

  portFolioList.addEventListener("change", () => {
    var selectedPortfolio =
      portFolioList.options[portFolioList.selectedIndex].value;
    if (selectedPortfolio === "null") {
      return null;
    }
    displayUserPortfolio(data, selectedPortfolio);
  });
};


// WE DESTRUCTURE AND DISPLAY RELEVANT PORTFOLIO DATA
const displayUserPortfolio = (userData, selectedPortfolio) => {
  const portFolioAccount = document.querySelector(".portfolio-account");
  portFolioAccount.classList.remove("portfolio-account-hidden");
  let { [0]: userAccountZero } = userData.results;
  let { [1]: userAccountOne } = userData.results;
  // destructuring of {results}
  let {
    provider,
    name,
    account_number,
    cash:Kontant,
    market_value:Marknadsvärde,
    change:Förändring,
    total_value: Totalt,
    positions
  } = userAccountZero;

  let {
    provider: providerOne,
    name: nameOne,
    account_number: account_numberOne,   
    cash:Cash,
    market_value:Market_value,
    change:Change,
    total_value: Total_value
  } = userAccountOne;

  // we create two new objects for each account
  userAccountZero = {
    Marknadsvärde,
    Kontant,
    Förändring,
    Totalt,
  };
  userAccountOne = {   
    Cash,
    Market_value,
    Change,
    Total_value
  };
  
  //const userProvider = document.getElementById("user-provider");
  const userName = document.getElementById("user-acc-name");
  const userAcc = document.getElementById("acc-number");

  if (selectedPortfolio === "zero") {
    userName.innerText = name;
    userAcc.innerText = ` Konto-nummer: ${account_number}`;
    generateList(userAccountZero);    
  } else if (selectedPortfolio === "one") {
    userName.innerText = nameOne;
    userAcc.innerText = ` Konto-nummer: ${account_numberOne}`;
    generateList(userAccountOne);    
    displayPortFolioStocks(userData)
  } else {
    portFolioAccount.classList.add("portfolio-account-hidden");
  }
};

// WE GENERATE ACCOUNT DATA 
const generateList = userAccount => {    
  const accountDetails = document.querySelector(".account-details");    
  // We empty all fields
  const fieldsToEmpty = document.querySelectorAll(".account-details,.account-instruments,.account-stocks"); 
  for(fields of fieldsToEmpty) {
    fields.innerHTML = "";
  }  

  const ulEl = document.createElement("ul");
  ulEl.setAttribute("class", "portfolio-detail-list");

  for (item in userAccount) {
    if (userAccount[item] !== null) {
      let liEl = document.createElement("li");
      let text = document.createTextNode(`${item}: ${userAccount[item]}`);
      liEl.appendChild(text);
      ulEl.appendChild(liEl);
    }
  }
  // we append account details to the DOM
  accountDetails.appendChild(ulEl);
};


// WE LOOP AND DISPLAY ALL INSTRUMENTS
const displayPortFolioStocks = userData => {  
  let instrumentData = userData.results[1].positions;  
  
  const accountStocks = document.querySelector(".account-stocks");
  const ulEl = document.createElement("ul");
  ulEl.setAttribute('class', 'portfolio-stock-list');
  
  // We loop through instrument data
  instrumentData.forEach(item => {
    // We create four rows of li:s
    let liOneEl = document.createElement("li");
    liOneEl.setAttribute('class','seperatorOne');
    let liDescEl = document.createElement("li");    
    liDescEl.setAttribute('class','company-description');
    let liSecEl = document.createElement("li");
    liSecEl.setAttribute('class','seperatorSec');
    let liThrEl = document.createElement("li");
    liThrEl.setAttribute('class','seperatorThr');

    // we create a description span
    let textRowDescription = document.createElement('span');    
    liDescEl.appendChild(textRowDescription);

    // we create a button 'mera info'
    const buttonEl = document.createElement('button'); 
    buttonEl.innerText = 'Mera Info';
    buttonEl.setAttribute('class', 'more-info');
    
    // description of company, if not null!  
    buttonEl.addEventListener('click', () => {
      if(textRowDescription.innerText !== "") {
        textRowDescription.innerText = "";
        buttonEl.innerText = 'Mera info';
      }
      else if(item.instrument.company !== null) {         
        var companyDescription = document.createTextNode(item.instrument.company.description);        
        textRowDescription.appendChild(companyDescription);                  
        buttonEl.innerText = 'Ta bort info';
      }
    })    

    // we add instrument values to each row
    let textRowOne = document.createTextNode(
      `Namn: ${item.instrument.name}, Kortnamn: ${item.instrument.symbol}, Land: ${item.instrument.country}, ${item.instrument.currency}`
    );
    let textRowSec = document.createTextNode(
        `Senast: ${item.instrument.price_today} Högst: ${item.instrument.price_high} Lägst: ${item.instrument.price_low}`
    );
    //let textTitleRow = "Värdeutveckling";
    let textRowThr = document.createTextNode(`             
          1 Dag: ${item.instrument.yield_1d} | 1 Vecka: ${item.instrument.yield_1w} | 1 Månad: ${item.instrument.yield_1m} | 6 Månader: ${item.instrument.yield_6m}          `        
    );        
    // we append all rows to the list
    liOneEl.appendChild(textRowOne);    
    liOneEl.appendChild(buttonEl);
    liSecEl.appendChild(textRowSec);       
    liThrEl.appendChild(textRowThr);       
    ulEl.appendChild(liOneEl);
    ulEl.appendChild(liDescEl);
    ulEl.appendChild(liSecEl);
    ulEl.appendChild(liThrEl);
  });
  accountStocks.appendChild(ulEl);
};

const getInstrumentDescription = (instrumentData)=> {
  instrumentData.forEach((item)=> {
    if(item.instrument.company !== null) {      
      console.log(item.instrument.company.description);
    }
  });
}

// SIGN OUT
const signOutUser = () => {
  console.log("sign out");
  // temp solution... next release; token is set to ""
  location.reload();
};

// GLOBAL ANCHORS AND LISTENERS
const loginForm = document.getElementById("login-form");
loginForm.addEventListener("submit", validateUserLogin);
const signOut = document.querySelector(".sign-out");
signOut.addEventListener("click", signOutUser);

