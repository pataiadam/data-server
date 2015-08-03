/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var fs = require('fs');
module.exports = {
	index: function(req, res){
    res.view();
  },

  brier: function (req, res) {
    res.view();
  },

  logarithmic: function (req, res) {
    res.view();
  },

  getLogarithmicData: function(req, res){
    if(!req.body || !req.body.action){
      return res.json({});
    }
    if(req.body.action==='getFiles') {
      return res.json(fs.readdirSync('./api/datas/estimate'))
    }else if(!!req.body.action) {
      var file = fs.readFileSync('./api/datas/estimate/' + req.body.action, {encoding: 'utf8'});
      var array = file.split('\n');
      var data = [];
      var labels = [];
      var i = 0;
      var sum = 0;
      array.map(function (s, t) {
        var v = s.split('\t');
        var p = parseFloat(v[3]);
        var x = parseInt(v[4]);
        var l = x * Math.log(p) + (1 - x) * Math.log(1 - p);
        sum += l;
        i++;
        if(!isNaN(sum / i)) {
          data.push(sum / i);
          labels.push(i);
        }
      });

      var limit = req.body.limit || 20;
      if(data.length<limit){
        limit = data.length;
      }
      var outData = [];
      var outLabels = [];
      for(i = 0; i<data.length; i+=data.length/limit){
        outData.push(data[~~i]);
        outLabels.push(labels[~~i]);
      }
sails.log.debug(outData);
      return res.json({data: {labels: outLabels, datasets: [{data: outData}]}, max: data.length});
    }
  },

  getBrierData: function(req, res){
    if(!req.body || !req.body.action){
     return res.json({});
    }
    if(req.body.action==='getFiles') {
      return res.json(fs.readdirSync('./api/datas/brier'))
    }else if(!!req.body.action){
      var file = fs.readFileSync('./api/datas/brier/'+req.body.action, {encoding: 'utf8'});
      var array = file.split('\n');
      var data = [];
      var labels = [];
      array.map(function (s, t) {
        if(s!==''){
          data.push(parseFloat(s));
          labels.push(t);
        }
      });
      var limit = req.body.limit || 20;
      if(data.length<limit){
        limit = data.length;
      }

      var outData = [];
      var outLabels = [];
      for(var i = 0; i<data.length; i+=data.length/limit){
        outData.push(data[~~i]);
        outLabels.push(labels[~~i]);
      }

      return res.json({data: {labels: outLabels, datasets:[{data:outData}]}, max: data.length});
    }
  },

  successRate: function (req, res) {
    res.view();
  },

  getSuccessRateData: function(req, res){
    if(!req.body || !req.body.action){
      return res.json({});
    }
    if(req.body.action==='getFiles') {
      return res.json(fs.readdirSync('./api/datas/estimate'))
    }else if(!!req.body.action){
      var file = fs.readFileSync('./api/datas/estimate/'+req.body.action, {encoding: 'utf8'});
      var array = file.split('\n');
      var data = [];
      var labels = [];
      var limit = req.body.limit || 50;
      limit/=100.0;
      var success={value: 0, label: 'success', color: "#46BFBD", highlight: "#5AD3D1"};
      var fail={value: 0, label: 'fail', color:"#F7464A", highlight: "#FF5A5E"};
      var totalMatches=0;
      var matches=0;

      array.map(function (s, t) {
        var v = s.split('\t');
sails.log.debug(v)
        if(parseFloat(v[3])>=limit){
          if(v[4]==='1'){
            success.value++;

          }else{
            fail.value++;
          }
          matches++;
        }
        totalMatches++;
      });

      return res.json({data: [success, fail], totalMatches: totalMatches, matches: matches});
    }
  }
};

