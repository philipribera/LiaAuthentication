const express = require('express');
const app = express();

app.listen(3000, ()=> console.log('listening') );
//var server = app.listen(3000);
//server.close()

app.use(express.static('public'));
app.use(express.json({limit: '1.5mb'}));

app.post('https://beta.stockzoom.com/api-token-auth/', (request, response)=> {
    console.log("I got a request");
    const data = request.body;
    const timestamp = Date.now();
    data.timestamp = timestamp;
    response.json({
        status: "success"
    });
})

app.get("https://beta.stockzoom.com/api/v1/me/portfolios/"), (request, response)=> {    
    console.log("We query the portfolio");    
    response.json()
}

app.get("https://beta.stockzoom.com/api/v1/instruments/{alias}/"), (request, response)=> {
    console.log("We query the portfolio instruments");    
    response.json()
}
