var repl = require('repl');
var rest = require('superagent');
var fs = require('fs');
var cav = require('csv');
var out = console.log;
var prompt = repl.start({prompt: 'coinbase:> '});
var url = 'https://coinbase.com/api/v1/currencies/exchange_rates'
var market = {
rates: {}
};

rest
.get(url)
.set('Accept', 'application/json')
.end(function(error, res){
    market.rates = res.body
    });


prompt.defineCommand('BUY',{
    action: function(cur){
        this.lineParser.reset();
        this.bufferedCommand = '';
        var mes = (`Order to BUY ${cur} worth of BTC queued BTC/USD()`);
        out(mes);
        market = mes;
        this.displayPrompt();
        return market;
 
	}
    });
prompt.defineCommand('SELL', {
    action: function(cur){
	this.lineParser.reset();
	this.bufferedCommand = '';
	var market = (`Order to SELL ${cur} worth of BTC queued BTC/USD()`);
	out(market);
	this.displayPrompt();
	return market;
	}
    });
prompt.defineCommand('ORDER',{
    action: function(market){
	this.lineParser.reset();
	this.bufferedCommand ='';
	fs.writeFile('coinbase.csv', market, function(err){
	    if(err){console.log(err)};
	    });
	out(fs.writeFile('coinbase.csv','UTF-8', function(err){
	    if(err){throw err};
	    }));
	this.displayPrompt();
	}
    });
