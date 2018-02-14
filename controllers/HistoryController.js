const mongoose = require('mongoose');

mongoose.connect('mongodb://worker:strongpassword123@ds233748.mlab.com:33748/walkmett-db');

var historySchema = new mongoose.Schema({
    videoId: { type: String },
    title: { type: String },
    thumbnail: { type: String },
}, { timestamps: true });

const History = mongoose.model('History', historySchema);

function HistoryController() {
  this.getHistory = function(req, res, next) {
    History.find().limit(10).sort({ createdAt: -1 }).exec((err, result) => {
      if (err) {
        return next(err);
      };
      return res.send({err: null, result});
    });
  };

  this.addToHistory = function(req, res, next) {
    let history = new History({
      videoId: req.body.videoId,
      title: req.body.title,
      thumbnail: req.body.thumbnail
    });

    history.save(err => {
      if (err) {
        return next(err);
      };
      return res.send({err:null, history});
    })
  };

  this.removeHistory = function(req, res, next) {
    History.findById(req.params.id).remove().exec(err => {
      if (err) {
        return next(err);
      };
      return res.send({err: null});
    })
  };
}

module.exports = new HistoryController();
