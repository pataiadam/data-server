var _ = require('lodash');
var d = require('euclidean-distance');
module.exports = {
  /**order:
   * { season: 'example-season',
   *   matches: [{home: 'HOME', away: 'AWAY'}],
   *   time: {from: 0, to: 1220},
   *   data: [{alg: 'pagerank', method: 'distance'},
   *          {alg: 'colley', method: 'distance'}]
   */
  get: function(order, data){
    var teams = helper.getTeams(data);
    order.sort='team';
    return order.matches.map(function(match){
      if(!(_.contains(teams, match.home) && _.contains(teams, match.away))){
        throw new Error('Not enough info about teams');
      }

      var rank = _.pluck(ranking.get(order, data), 'ranking');
      var homeWinData = data.concat([match.home+',100,'+match.away+',80,2.00,2.00']);
      var rankH =  _.pluck(ranking.get(order, homeWinData), 'ranking');
      var awayWinData = data.concat([match.home+',80,'+match.away+',100,2.00,2.00']);
      var rankA =  _.pluck(ranking.get(order, awayWinData), 'ranking');

      var h = d(rank, rankH);
      var a = d(rank, rankA);

      if(a+h==0){
        h=1;
        a=1;
      }

      return {
        home: {team: match.home, p: a/(a+h)},
        away: {team: match.away, p: h/(a+h)},
        method: 'pageRank-dist'//TODO
      };
    });
  },

  distance: function(){

  }
};
