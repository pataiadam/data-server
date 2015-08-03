module.exports = {

  getTeams: function(matches){
    var that= this;
    var teams = [];
    matches.map(function(match){
      var sp = match.split(',');
      if(sp[0]===''){
        return;
      }
      if(!that.contains(teams, sp[0])){
        teams.push(sp[0])
      }
      if(!that.contains(teams, sp[2])){
        teams.push(sp[2])
      }
    });
    return teams;
  },

  contains: function(arr, v) {
    for(var i = 0; i < arr.length; i++) {
      if(arr[i] === v) return true;
    }
    return false;
  }
};
