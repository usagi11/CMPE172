const request = require('superagent');
const repl = require('repl');
var _ = require('underscore');
var fs = require('fs');
var csv = require('fast-csv');
var market = {
    rates: {}
    };
var url = 'https://coinbase.com/api/v1/currencies/exchange_rates';
var out = console.log;
var orderList = [];
var date = new Date();


//to get current rate
request
.get(url)
.set('Accept', 'application/json')
.end(function(err,res,body){
     if(err){
	 console.log(err);
	  }
     else{
	  return market.rates = res.body;
	  }
    })

//show the prompt
const r = repl.start({prompt: 'coinbase> ', eval: myEval});
function myEval(cmd, currency, amount, callback){
    var act = cmd.split(" ");
    var action = act[0].toUpperCase();
    action = action.replace(/\s+/g,"");
    
    switch(action){
	case "BUY":
	checkOrder(act);
	break;
	case "SELL":
	checkOrder(act);
	break;
	case "ORDERS":
	orders();
	break;
	default:
	out("No specified action")
	break;
	}
    this.displayPrompt();
}


//buy and sell function
function checkOrder(cmd){
    var action = cmd[0].toUpperCase();
    var amount = parseFloat(cmd[1]);
    var currency = cmd[2];
    var total = '';

    if(amount === null || isNaN(amount)){
	out('No amount specified');
	return "";
	}
    //check the amount exists
    if(!isNaN(amount) && amount > 0){
	action = action.toUpperCase();
	//if currency is empty
	if(!cmd[2]){
	    currency = 'BTC';
	    out(`Order to ${action} ${amount} ${currency} queued.`);
	    var checkCurrency = 'btc_to_btc';
	    var rate = market.rates[checkCurrency];
	    currency = currency.toUpperCase();
	    total = rate * amount;
	    orderList.push({timestamp: date, type: action, amount: amount, currency: currency, total: total});
	    return "";
	}
	//if currency exists
	if(currency !== null){
	    var currency = currency.replace(/\s+/g,"");
	    
	    //check the action: BUY
	    if(action === 'BUY'){
		checkCurrency = currency.toLowerCase() + '_to_btc';
		}
	    
	    //check the action: SELL
	    if(action === 'SELL'){
		checkCurrency = 'btc_to_' + currency.toLowerCase();
		}
	    //get the rate of the currency
	    rate = market.rates[checkCurrency];
	    
	    //check if currency exists
	    //if there is no currency 
	    if(isNaN(rate)){
		currency = currency.toUpperCase();
		out(`No known exchange rate for BTC/${currency}. Order failed.`);
		}
	    //if there is currency
	    if(!isNaN(rate)){
		var total = rate * amount;
		total = total.toFixed(4);
		total = parseInt(total);
		//push the order to the orderList
		currency = currency.toUpperCase();
		orderList.push({timestamp: date, type: action, amount: amount, currency: currency, total: total});

		if(action === 'BUY'){
		    out(`Order to ${action} ${amount} ${currency} worth of BTC queued @${total} BTC/${currency} (${rate} BTC)`);
		    }
		if(action === 'SELL'){
		    total = -total;
		    out(`Order to ${action} ${amount} ${currency} worth of BTC queued @${total} ${currency}/BTC (${rate} BTC)`);
		    }
		}
	    }

    }
    
    
    //if amount is null or less than 0 return error
    if(isNaN(amount) && amount <= 0){
	return out('No amount specified')
	}
}

//display orders
function orders(){
    out("==== CURRENT ORDERS ===");
    var totalAmount = _.pluck(orderList, 'total');
    var sum = totalAmount.reduce(calSum);
    out(`CURRENT  : ${sum}`);
    

    //display each order with date
    _.each(orderList,function(list){
	out(`${list.timestamp} : ${list.type} ${list.amount} ${list.currency} : UNFILLED`);
	});

    //script of csv file
    var result = _.map(orderList, function(list){
	return {
	    "timestamp": list.timestamp,
	    "buyOrsell": list.type,
	    "amount": list.amount,
	    "currency": list.currency,
	    "conversion rate to BTC": list.rates
	    };
	});

    //making csv file
    var writableStream  = fs.createWriteStream('order.csv');
    csv.write(result, {headers: true}).pipe(writableStream);

}
// function of sum
function calSum(x,y){
    return x + y;
}


