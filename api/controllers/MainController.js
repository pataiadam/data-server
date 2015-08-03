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

  /**order:
   * { season: 'example-season',
   *   time: {from: 0, to: 1220},
   *   data: [{alg: 'pagerank', method: 'distance'},
   *          {alg: 'colley', method: 'distance'}]
   */
  process: function(req, res){
    if(!req.body || !req.body.order){
      return res.json({status: 'missing params'});
    }
    var o=req.body.order;
    var file = fs.readFileSync('./api/datas/input/data_odds-'+o.season+'.csv', {encoding: 'utf8'});
    var data = file.split('\n');
    data=_.slice(data, o.time.from, o.time.to);
    var teams = helper.getTeams(data);
    var rankings;
    o.data.map(function (e) {
      //TODO: Filter by order
      rankings = algorithm.pagerank(data, teams);
    });

    function compare(a,b) {
      if (a.ranking < b.ranking)
        return -1;
      if (a.ranking > b.ranking)
        return 1;
      return 0;
    }

    rankings.sort(compare);

    var chart = {data: {labels: _.pluck(rankings, 'team'), datasets: [{data: _.pluck(rankings, 'ranking')}]}};
    return res.json({rankings: rankings, chart: chart});
  }
};

