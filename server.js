const bodyParser = require('body-parser')
const express = require('express')
const nunjucks = require('nunjucks')
const path = require('path')
const request = require('request');

const app = express()


const port = process.env.PORT || 5000

//body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'static')))

nunjucks.configure('views', {
  autoescape: true,
  express: app
});

app.get('/', function(req, res) {
  res.render('form.html')
})

app.get('/view-manifest', function(req, res) {
  let json =  null
  let error = null
  const url = req.query.url

  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      json = JSON.parse(body);
      return res.render('view-manifest.html', {data: JSON.stringify(json, null, 4)})
    }
    else {
      error = "Couldn't download manifest file, please try again."
      return res.render('view-manifest.html', {error: error})
    }
  })
})

app.get('/view-requests', function(req, res) {
  res.render('view.html')
})

app.get('/success', function(req, res) {
  res.render('success.html');
});

app.listen(port, () => console.log(`Server Started at port ${port}`))
