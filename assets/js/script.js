function getBrierData(action, limit){
  $.post( "getBrierData", { action: action, limit: limit || 20 }, function( data ) {
    if (action !== 'getFiles') {
      $("#title").text(action);
      var options = {
        animation: false
      };
      var ctx = document.getElementById("brierChart").getContext("2d");

      if( window.myLineChart!==undefined)
        window.myLineChart.destroy();
      window.myLineChart = new Chart(ctx).Line(data.data, options);
      $( "#slider" ).slider({
        value: limit||20,
        min: 10,
        max: data.max,
        stop: function( event, ui ) {
          getBrierData(action, ui.value);
        },
        slide: function( event, ui ) {
          $("#value").text(ui.value);
        }
      });
    } else{

      $.each( data, function( i, val ) {
        var result = $(".result");
        //result.remove();
        var d=document.createElement('div');
        $(d).attr('id', val)
          .html('<a href="#">'+val+'</a>')
          .appendTo(result)
          .click(function() {
            getBrierData(val);
          });
      });
    }
  });
}
getBrierData('getFiles');

function getLogarithmicData(action, limit){
  $.post( "getLogarithmicData", { action: action, limit: limit || 20 }, function( data ) {
    if (action !== 'getFiles') {
      $("#title-logarithmic").text(action);
      var options = {
        animation: false
      };
      var ctx = document.getElementById("logarithmicChart").getContext("2d");

      if( window.myLineChart!==undefined)
        window.myLineChart.destroy();
      window.myLineChart = new Chart(ctx).Line(data.data, options);
      var s=$( "#slider-logarithmic" );

      s.slider({
        value: limit||20,
        min: 10,
        max: data.max,
        stop: function( event, ui ) {
          console.log(ui.value)
          getLogarithmicData(action, ui.value);
        },
        slide: function( event, ui ) {
          $("#value-logarithmic").text(ui.value);
        }
      });
    } else{

      $.each( data, function( i, val ) {
        var result = $(".result-logarithmic");
        //result.remove();
        var d=document.createElement('div');
        $(d).attr('id', val)
          .html('<a href="#">'+val+'</a>')
          .appendTo(result)
          .click(function() {
            getLogarithmicData(val);
          });
      });
    }
  });
}
getLogarithmicData('getFiles');

function getSuccessRateData(action, limit){
  $.post( "getSuccessRateData", { action: action, limit: limit || 50 }, function( data ) {
    if (action !== 'getFiles') {
      $("#title-successRate").text(action);
      var options = {animateRotate: false};
      var ctx = document.getElementById("successRateChart").getContext("2d");

      if( window.myPieChart!==undefined)
        window.myPieChart.destroy();
      window.myPieChart = new Chart(ctx).Pie(data.data,options);
      $( "#slider-successRate" ).slider({
        value: limit||50,
        min: 50,
        max: 100,
        stop: function( event, ui ) {
          getSuccessRateData(action, ui.value);
        },
        slide: function( event, ui ) {
          $("#value-successRate").text(ui.value+'%');
        }
      });
      $("#value-totalMatches").text(data.totalMatches);
      $("#value-matches").text(data.matches);
    } else{

      $.each( data, function( i, val ) {

        var result = $(".result-successRate");
        //result.remove();
        var d=document.createElement('div');
        $(d).attr('id', val)
          .html('<a href="#">'+val+'</a>')
          .appendTo(result)
          .click(function() {
            getSuccessRateData(val);
          });
      });
    }
  });
}
getSuccessRateData('getFiles');
