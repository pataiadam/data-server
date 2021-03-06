function selectSeason(){
  var matchesNumber = parseInt($('.'+$( ".liga:checked")[0].value+'-matches')[0].innerText);
  console.log(matchesNumber);
  $( "#slider-range" ).slider( "option", "max", matchesNumber ).slider( "option", "values", [ 0, matchesNumber ] );
  $( "#amount" ).val(  $( "#slider-range" ).slider( "values", 0 ) +
    " - " + $( "#slider-range" ).slider( "values", 1 ) );
}

function process(){
  /**order:
   * { season: 'example-season',
   *   time: {from: 0, to: 1220},
   *   data: [{alg: 'pagerank', method: 'distance'},
   *          {alg: 'colley', method: 'distance'}]
   */
  var order = {
    season: $( ".liga:checked")[0].value,
    time: {
      from: $( "#slider-range" ).slider( "values", 0 ),
      to: $( "#slider-range" ).slider( "values", 1 )
    },
    data: [{alg: 'pagerank', method: 'distance'}]
  };
  $.post( "/main/process", {order: order}, function( data ) {
    console.log(data);
    var options = {
      animation: false
    };
    var ctx = document.getElementById("rankingChart").getContext("2d");

    if( window.myLineChart!==undefined)
      window.myLineChart.destroy();
    window.myLineChart = new Chart(ctx).Bar(data.chart.data, options);
  });
}

function select(){
  window.location.assign("/main/estimate/?liga="+$( ".liga:checked")[0].value);
}

function estimate(){
  var away = $('#away option:selected')[0].value;
  var home = $('#home option:selected')[0].value;
  var order = {
    season: $( ".liga:checked")[0].value,
    matches: [{home: home, away: away}],
    time: {
      from: $( "#slider-range" ).slider( "values", 0 ),
      to: $( "#slider-range" ).slider( "values", 1 )
    },
    data: [{alg: 'pagerank', method: 'distance'}]
  };
  $.post( "/main/estimateGraph", {order: order}, function( data ) {
    console.log(data);
    var options = {
      animation: false
    };
    var ctx = document.getElementById("estimateChart").getContext("2d");

    if( window.myBarChart!==undefined)
      window.myBarChart.destroy();
    window.myBarChart = new Chart(ctx).Bar(data.chart.data, options);
  });
}


  $( "#slider-range" ).slider({
    range: true,
    min: 0,
    max: 20,
    values: [ 0, 20 ],
    slide: function( event, ui ) {
      $( "#amount" ).val(ui.values[ 0 ] + " - " + ui.values[ 1 ] );
    }
  });

  $( "#amount" ).val( $( "#slider-range" ).slider( "values", 0 ) +
    " - " + $( "#slider-range" ).slider( "values", 1 ) );

selectSeason();
