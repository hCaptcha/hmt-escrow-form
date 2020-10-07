const bodyParser = require('body-parser')
const express = require('express')
const nunjucks = require('nunjucks')
const path = require('path')

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

app.get('/view-manifest/:manifestUrl', function(req, res) {
  res.render('view-manifest.html', {url: req.params.manifestUrl})
})

app.get('/view-requests', function(req, res) {
  res.render('view.html')
})

app.get('/success', function(req, res) {
  res.render('success.html');
});

app.listen(port, () => console.log(`Server Started at port ${port}`))
