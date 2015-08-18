var fs = require('fs');
var _ = require('lodash');
module.exports = {
  /**o:
   * { season: 'example-season',
   *   time: {from: 0, to: 1220},
   *   data: [{alg: 'pagerank', method: 'distance'},
   *          {alg: 'colley', method: 'distance'}]
   */
  get: function(o, data) {
    var teams = helper.getTeams(data);
    var rankings;
    o.data.map(function (e) {
      //TODO: Filter by order
      rankings = algorithm.pagerank(data, teams);
    });

    function sortRanking(a, b) {
      if (a.ranking < b.ranking)
        return -1;
      if (a.ranking > b.ranking)
        return 1;
      return 0;
    }

    function sortTeam(a, b) {
      if (a.team < b.team)
        return -1;
      if (a.team > b.team)
        return 1;
      return 0;
    }

    if (o.sort === 'team') {
      sails.log.debug('TEAM SORTING')
      rankings.sort(sortTeam);
    } else {
      rankings.sort(sortRanking);
    }
  /*
    [{team: 'A', ranking: 0}, {...}, ...]
     */
    return rankings;
  }
};
