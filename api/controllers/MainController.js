/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var fs = require('fs');
var files = fs.readdirSync('./api/datas/input');
var r = files.map(function (f) {
  var file = fs.readFileSync('./api/datas/input/' + f, {encoding: 'utf8'});
  var array = file.split('\n');
  return {name: f.substr(10, f.indexOf('.')-10), teams: helper.getTeams(array).length, matches: array.length-1}
});
var _ = require('lodash');
module.exports = {
  index: function(req, res){
    res.view();
  },

	ranking: function(req, res){
    res.view({season: r});
  },

  estimate: function(req, res){
    if(!req.query.liga){
      return res.json({});
    }
    var file = fs.readFileSync('./api/datas/input/data_odds-'+req.query.liga+'.csv', {encoding: 'utf8'});
    var data = file.split('\n');
    var teams = helper.getTeams(data);
    var season = [];
    r.map(function(s){
      if(s.name===req.query.liga){
        season.push(s);
      }
    });
    return res.view({season: season, teams: teams});
  },

  process: function(req, res){
    if(!req.body || !req.body.order){
      return res.json({status: 'missing params'});
    }
    var o = req.body.order;
    var file = fs.readFileSync('./api/datas/input/data_odds-'+o.season+'.csv', {encoding: 'utf8'});
    var data = file.split('\n');
    data=_.slice(data, o.time.from, o.time.to);
    var rankings = ranking.get(o, data);
    var chart = {data: {labels: _.pluck(rankings, 'team'), datasets: [{data: _.pluck(rankings, 'ranking')}]}};
    return res.json({rankings: rankings, chart: chart});
  },

  estimateGraph: function(req, res){
    if(!req.body || !req.body.order){
      return res.json({status: 'missing params'});
    }
    var o = req.body.order;
    var file = fs.readFileSync('./api/datas/input/data_odds-'+o.season+'.csv', {encoding: 'utf8'});
    var data = file.split('\n');
    data=_.slice(data, o.time.from, o.time.to);
    var e = estimate.get(req.body.order, data);
    sails.log.debug(e);
    var chart = {
      data: {
        labels: _.pluck(e, 'method'),
        datasets: [
          {label: _.pluck(_.pluck(e, 'home'), 'team'),
            data: _.pluck(_.pluck(e, 'home'), 'p'),
            fillColor: "rgba(220,220,220,0.9)"},
          {label: _.pluck(_.pluck(e, 'away'), 'team'),
            data: _.pluck(_.pluck(e, 'away'), 'p'),
            fillColor: "rgba(151,187,205,0.9)"}
        ]}};
    res.json({chart: chart})
  }
};

