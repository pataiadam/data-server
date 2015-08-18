var matrix = require( 'dstructs-matrix' );
var blas1 = require('ndarray-blas-level1');
var ndarray = require('ndarray');
module.exports = {
  pagerank: function(data, teams){

    var m = data.length;
    var n = teams.length;
    sails.log.debug(m)
    var C = matrix([n,n]);
    for(var i = 0; i<m; i++){
      var row = data[i].split(',');
      var homeIndex = _.indexOf(teams, row[0]);
      var awayIndex = _.indexOf(teams, row[2]);
      if(parseInt(row[1])>=parseInt(row[3])){
        C.set(homeIndex, awayIndex, C.get(homeIndex, awayIndex)+1);
      }else{
        C.set(awayIndex, homeIndex, C.get(awayIndex, homeIndex)+1);
      }
    }

    var alpha = 0.85;
    var P =  matrix([n,n]);
    var deg =  matrix([n,1]);
    for(var j = 0; j<n; j++){
      for(i=0; i<n; i++) {
        deg.set(j, 0, deg.get(j, 0) + C.get(i, j));
      }
      if(deg.get(j, 0)!==0){
        for(i=0; i<n; i++) {
          P.set(i, j, (1/deg.get(j, 0))* C.get(i, j));
        }
      }else{
        for(i=0; i<n; i++) {
          P.set(i, j, 1/n);
        }
      }
    }
    var M =  this.add(this.scalar(alpha, P),this.scalar((1-alpha),this.eye(n, 1/n)));

    var tol = 0.0000005;
    var p = this.eye(n, 1/n, true);
    var norm=1;
    do{
      var p_ = p.sget( ':,:' );
      p=this.dot(M, p);
      var k = this.minus(p, p_);
      norm=this.norm(k);
    }
    while(norm>tol);

    this.minus(matrix([1,5,8], [3,1]), matrix([1,2,3], [3, 1]));


    return teams.map(function (team, i) {
      return {team: team, ranking: p.get(i, 0)};
    })
  },

  eye: function(d, n, isVector){
    if(!n && n!==0){
      n=1;
    }
    var d2=d;
    if(!!isVector){
      d2=1;
    }
    var M = matrix([d, d2]);
    for(var i = 0; i<d; i++){
      for(var j = 0; j<d2; j++){
        M.set(i, j, n);
      }
    }

    return M;
  },

  scalar: function(a, M){
    for(var i = 0; i<M.shape[0]; i++){
      for(var j = 0; j<M.shape[1]; j++){
        M.set(i, j, a* M.get(i,j));
      }
    }
    return M;
  },

  add: function(A, B){
    for(var i = 0; i<A.shape[0]; i++){
      for(var j = 0; j<A.shape[1]; j++){
        A.set(i, j, A.get(i,j)+ B.get(i, j));
      }
    }
    return A;
  },

  minus: function(A, B){
    var r = matrix(A.shape);
    for(var i = 0; i<A.shape[0]; i++){
      for(var j = 0; j<A.shape[1]; j++){
        r.set(i, j, A.get(i,j)- B.get(i, j));
      }
    }
    return r;
  },

  norm: function(x){
    var data = [];
    for(var i = 0; i<x.shape[0]; i++){
       data.push(x.get(i,0));
    }
    x = ndarray(data);
    return blas1.nrm2(x);
  },

  dot: function(A, x){
    var r = this.eye(A.shape[0], 0, true);
    for(var i = 0; i<A.shape[0]; i++){
      for(var j = 0; j<A.shape[1]; j++){
        r.set(j, 0, r.get(j, 0)+A.get(j, i)* x.get(i,0));
      }
    }
    return r;
  }
};
