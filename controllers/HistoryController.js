function HistoryController () {
  this.getHistory = function (req, res, next) {
    console.log('get history will be here')
  }

  this.addToHistory = function (req, res, next) {
    console.log('add to history will be here')
  }

  this.removeHistory = function (req, res, next) {
    console.log('remove history will be here')
  }
}

module.exports = new HistoryController()
