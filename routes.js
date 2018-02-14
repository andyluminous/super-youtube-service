const path = require('path');
const HistoryController = require('./controllers/HistoryController');

function Routes () {
  this.configure = function (app) {
    app.get('/api/history', HistoryController.getHistory);
    app.post('/api/history', HistoryController.addToHistory);
    app.delete('/api/history', HistoryController.removeHistory);

    app.use(function (error, req, res, next) {
      if (error) {
        console.error({ message: 'ERROR', err_message: error, err_stack: error.stack, ip: req.ip, method: req.method, route: req.originalUrl });
        res.status(500).send('Something broke!');
      }
      next()
    })

    app.use('/api/*', function (req, res) {
      res.status(404).send({ err: null, code: 404 });
    })
    app.use('/*', sendIndexPage);
  }
}

function sendIndexPage (req, res) {
  res.sendFile('index.html', { root: path.join(__dirname, '/public') });
}

module.exports = new Routes();
