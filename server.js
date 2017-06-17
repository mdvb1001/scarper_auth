var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var path = require('path');
var app = express();

// Set Request defaults...
reqs = request.defaults({
  jar: true,                 // save cookies to jar
  rejectUnauthorized: false,
  followAllRedirects: true   // allow redirections
});
console.log(reqs);

app.get('/scrape', function (req, res) {
    url = 'http://www.imdb.com/title/tt1229340/?ref_=fn_al_tt_1';
    reqs(url, function (error, response, html) {
        if (!error) {
            var $ = cheerio.load(html);
            var title, release, rating, summary;
            var json = {
                title: "",
                release: "",
                rating: "",
                summary: "",
            };
            $('.title_wrapper').filter(function () {
                var data = $(this);
                title = data.children().first().text();
                json.title = title;
                console.log(json.title);
            });
            $('.subtext').filter(function () {
                var data = $(this);
                release = data.children().last().text();
                json.release = release;
                console.log(json.release);
            });
            $('.ratingValue').filter(function () {
                var data = $(this);
                rating = data.text();
                json.rating = rating;
                console.log(json.rating);
            });
            $('.plot_summary').filter(function () {
                var data = $(this);
                summary = data.children().first().text();
                json.summary = summary;
                console.log(json.summary);
            });
        }
        // To write to the system we will use the built in 'fs' library.
        // In this example we will pass 3 parameters to the writeFile function
        // Parameter 1 :  output.json - this is what the created filename will
        // be called
        // Parameter 2 :  JSON.stringify(json, null, 4) - the data to write,
        // here we do an extra step by calling JSON.stringify to make our JSON
        // easier to read
        // Parameter 3 :  callback function - a callback function to let us know
        // the status of our function
        fs.writeFile('output.json', JSON.stringify(json, null, 4),
            function (err) {
            console.log('File successfully written! - Check your project' +
              'directory for the output.json file');
        });
        // Finally, we'll just send out a message to the browser reminding you
        // that this app does not have a UI.

        // document.getElementById("data").innerHTML = txt;

        // res.sendFile(path.join(__dirname, "index.html"));
        res.send(json);
    });
});
app.listen('8081');
console.log('Magic happens on port 8081');
exports = module.exports = app;