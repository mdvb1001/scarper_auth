var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

app.get('/scrape', function(res, req) {
// All the magic will happen here fools
// The URL we will scrape from - in our example Anchorman 2.

    url = 'http://www.imdb.com/title/tt1229340/';

    // The structure of our request call
    // The first parameter is our URL
    // The callback function takes 3 parameters, an error, response status code
    // and the html

    request(url, function(error, response, html){

        // First we'll check to make sure no errors occurred when making the
        // request

        if(!error){
            // Next, we'll utilize the cheerio library on the returned html
            // which will essentially give us jQuery functionality

            var $ = cheerio.load(html);

            // Finally, we'll define the variables we're going to capture

            var title, release, rating;
            var json = { title : "", release : "", rating : ""};

            // We'll use the unique header class as a starting point.

            $('.header').filter(function(){
                var data = $(this);
                title = data.children().first().text();

                // We will repeat the same process as above.  This time we notice that the release is located within the last element.
                // Writing this code will move us to the exact location of the release year.

                release = data.children().last().children().text();

                json.title = title;

                // Once again, once we have the data extract it we'll save it to our json object

                json.release = release;
            });
        }
    });
});

app.listen('8081');

console.log('Magic happens on port 8081');

exports = module.exports = app;
