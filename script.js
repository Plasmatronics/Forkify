'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////
//Asynchronous JavaScript, Ajax, and Apis//
/*What is SYNCHRONOUS CODE (what we have written so far)--> code is executed line by line in order.
    This can create problems when certain lines of code take a long time to run
    For example with alert(), code will be blocked until "Ok" is presssed which can be minutes.
What is ASYNCHRONOUS CODE-code that is executed after a task that runs in the background finishes.
    For example if we had a setTimeout function with 5000ms then it turned some text red, the text would have to wait for the whole timer.
    This is why we have asyncronous code, setTimeout is an example of asynchronous javascript.
    This code is non-blocking and execution doesnt wait for an asynchronous task to finish its work.
    Async code is actualyl executed AFTER all synchronous code has finished.
    Callback functions alone DO NOT make code async... array.map function does NOT automatically make code async.
    when we defer an action into the future---> this is asynchronous javascript.
    addEventlistner is not asychronous bc while it is waiting there is nothing happen in the background.
    Ajax is probably the most imoprtant use case of async javascript.
 */

/*What is AJAX(asynchonrous javascript and XML)?
It allows us to communicate with remote web servers in an asynchronous way. With AJAX, we can request
data from web servers dynamically.
Lets say we have js code running in the browser (also known as the client). We can make a request to a web server asking for some data and the server can fufill the response. This back and forth happens asynchronously in the bg.
There are different kinds of requests. 
Usually an the web server in this example would be an API.
 */

/**
 What is an API(Application Programming Interface)?
 They are a piece of software that can be used by another piece of software, in order to allow applications to talk to each other.//
 THIS IS A VERY HIGH LEVEL OF ABSTRACTION OVERVIEW.
 There can be many types of APIS in web development.
 There is the DOM API and Geolocation API. They are called APIS because they are a self contained piece of software that allow other pieces of software to interact with them.
The public interface of a class can be seen as an API.
Typically when we refer to APIs, specifically alongside AJAX, we are talking about "Online APIs".
An Online API: an application running on a server that recieves requests for data, searches for it in a databse, and sends data back as reponse.
"Online API" is what we typically mean when we just say "API".
We can build our own web APIS but that would require our own web APIS.
There is an API for everything----> weather data, data about countries, flights data, google maps, etc etc...// 
XML is a data form that used to be widely used to transport data on the web.
Basically no website uses XML these days anymore, most of the time its going to be a JSON, which is a data format that is basically a js object converted to a string.
*/
//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
//In js there are multiple ways of doing data calls, but well start with the most old school way: XML Http request function//
//old but well show you now bc you might run into it and bc show u how ajax used to be used with events and callbacks//
//then well move onto the more modern promises method//
if (0 === 1) {
  const getCountryData = function (country) {
    const request = new XMLHttpRequest();
    request.open('GET', `https://restcountries.com/v3.1/name/${country}`);
    //first arguement is type of request, second is the url where the call will be made//
    //this http comes from a github database of public APIS//
    //Any API you use should have CORS(Cross Orgin Resource Sharing) set to yes (or maybe unknown), without course we cant access 3rd party API from our code//
    //now we must send the request//
    request.send(); //we cant set this to a variable bc the data isnt quite here yet
    //we would have to put it into variable upon recieving the info (eventlistenr)//

    request.addEventListener('load', function () {
      const [data] = JSON.parse(this.responseText); //an array of one object so lets destructure it//
      console.log(data);

      const html = `        
  <article class="country">
  <img class="country__img" src="${data.flags.png}" />
  <div class="country__data">
    <h3 class="country__name">${data.name.common}</h3>
    <h4 class="country__region">${data.region}</h4>
    <p class="country__row"><span>👫</span>${+(
      data.population / 1_000_000
    ).toFixed(1)} Million People</p>
    <p class="country__row"><span>🗣️</span>${
      Object.entries(data.languages)[0][1]
    }</p>
    <p class="country__row"><span>💰</span>${
      Object.entries(Object.entries(data.currencies)[0][1])[1][1]
    } ${Object.entries(Object.entries(data.currencies)[0][1])[0][1]}</p>
  </div>
</article>
`;
      countriesContainer.insertAdjacentHTML('beforeend', html);
      countriesContainer.style.opacity = 1;
    });
  };
  getCountryData('italy');
  getCountryData('usa'); //theses two AJAX calls happen side by side//
  getCountryData('hong kong');
  getCountryData('Senegal');
  getCountryData('india');
}
//------------------------------------------------------------------------------------------------------------------------------------//

//How the Web Works//
/*
  every client is given a protocol (http typically) a domain name (the main body) and a resource (the code after the slash at the end)//
This isnt the real name of the server, the servers actual (much less memorizable) name is stored in the DNS(domain name system). The first thing whenever we access a page
is the page is looked up and matched from the domain to the actualy storage slot in the DNS.
This all happens on your ISPs's end.
The real address has the protocol, the ip adress, and the port number (to identify a specific service runnign on a server).
Next, a TCP(transmission control protocol/internet protocol) socket connection is established between the client and web server.
Together, they establuish the rules for how the data is exhcnaged on the internet.
Then an http request is sent from the client to the web, which establishes the ability to send request/response messages.
Multiple requests and responses can happen at the same time depending on, how many requests are in a script, if the web server responds with a script that does more requests, etc.

As for TCP and IP:
The job for TCP is to break the requests and responses into thousands of small packets, then send them to their findal destination then repackage them.
This is necessary bc each packet needs to be able to take a different route through the internet to the web server. Otherwise requests would take much longer to be met w a response.
The IP's job is routing each packet through assigning each packet Ip addresses and the such.
 */
//------------------------------------------------------------------------------------------------------------------------------------//

//Welcome to Callback Hell//
//lets produce a call so that it only happens after one call finishes
const renderCountry = function (data, className) {
  const html = `
      <article class="country ${className}">
      <img class="country__img" src="${data.flags.png}"/>
      <div class="country__data">
        <h3 class="country__name">${data.name} (${data.nativeName})</h3>
        <h4 class="country__region">${data.region}</h4>
        <p class="country__row"><span>👫</span>${(
          +data.population / 1000000
        ).toFixed(1)} people</p>
        <p class="country__row"><span>💰</span>${data.currencies[0].name} (${
    data.currencies[0].code
  })</p>
        <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
      </div>
    </article>
      `;

  countriesContainer.insertAdjacentHTML('beforeend', html);

  countriesContainer.style.opacity = 1;
};

const getCountryAndNeighbor = function (country) {
  // AJAX call country 1
  const request = new XMLHttpRequest();
  request.open(
    'GET',
    `https://restcountries.com/v2/name/${country}?fullText=true`
  );
  request.send();

  request.addEventListener('load', function () {
    const [data] = JSON.parse(this.responseText);
    console.log(data);

    // Render country 1
    renderCountry(data);

    // Get neighbour country (2)
    const [neighbour] = data.borders;

    if (!neighbour) return;

    // AJAX call country 2
    const request2 = new XMLHttpRequest();
    request2.open(
      'GET',
      `https://restcountries.com/v2/alpha/${neighbour}?fullText=true`
    );
    request2.send();

    request2.addEventListener('load', function () {
      const data2 = JSON.parse(this.responseText);
      console.log(data2);

      renderCountry(data2, 'neighbour');
    });
  });
};

//Callback Hell: When we have one async request waiting for another async callback request, lets say nested 10 times.//
//Callback Hell makes our code hard to understand, which will cause more bugs and make it harder to update and add new feature to code//
//Solution to Callback Hell: Promises!
//------------------------------------------------------------------------------------------------------------------------------------//

//Promises and the Fetch API//
//Lets now get rid of the old way of AJAX and repalce it with the modern: Fetch API//
if (0 === 1) {
  const request = fetch();
} //pass in url as arguement... it can also take in an object of options.//
//Thats is... much easier.//
//This will return a promise with promiseStatus and promiseValue//

//What's a Promise?(ES6)//
//An object that is used as a placeholder for the future result of an asynchronous operation
//----> (DUMBED DOWN)A container for an asycnhronously delivered value//
//----->(DUMBED DOWN FURTHER) ac container for a future value.//
//This value will be a response from an AJAX call.//
//a promise is like a lottey ticket--> i get the ticket and wait for the lottery to happens and if it hits i have this to exchange for money//
//promises advantage: we dont need events and callback functions (can cause unpredictable results).//
//we can chain promises, which allows us to escape callback hell.

/*The Promise Lifecycle
step 1 pending: before the future value is available and one async task is done the promise is settled(can be fufilled or rejected promise).
The promise would be the lottery ticekt the async task would be like the lottery we wait for and the settlement will be like if we have a winning or losing number.//
 we can handle these different states in our code.
 Promises can be fufilled or setlled THEN WILL STAY AT THAT STATE. Once code is ran, promise will stay in that final state.
 We consume a promise when we use a promise to get a result.
 Fetch API builds and returns promises for us to make for easy consumption.
 */
//------------------------------------------------------------------------------------------------------------------------------------//

//Consuming Promises//
const request = fetch(`https://restcountries.com/v2/name/Italy?fullText=true`);

//we can use then on the conditional basis that the fetch is fufilled//
const getCountryData = function (country) {
  fetch(`https://restcountries.com/v2/name/${country}?fullText=true`)
    .then(response => {
      //then must be given the one paremeter, and that is the restuling value of the fufilled promise//
      //this resulting response has a bunch of data, but usually all were interested in exists in the response body.//
      //at first the body just has a "ReadableStream", so we have to call a method(json is available on all resolved promises) to convert this.//
      //json itself is an async method and returns a promise, which is why we need to chain another then.//
      return response.json();
    })
    .then(data => {
      //now we can actually read that data//
      renderCountry(data[0]);
    });
};
getCountryData('senegal');
//this code is not only nicer but easier to read and reason about//
//------------------------------------------------------------------------------------------------------------------------------------//

//Chaining Promises//
