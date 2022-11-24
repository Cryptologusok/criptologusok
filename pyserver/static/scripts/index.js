//declare global variables
let chart;
let chartLine;
let chartData;
let createChartData;

// available stats
stats = ['median','stdev'] ;

// available values for x axis
//allX = ['bloc','cr_b','ft_s'] ; 
//allX = ['bloc','cr_b','ft_s','it_s','size','inpc','outc','time','trnr'] ;
allX = ['blockid','currency_rate_bitcoin','fee_total_satoshi','input_total_satoshi','size','input_count','output_count','time','transaction_number'] ;

/* 
    "bloc" : "blockid",
    "time" : "time",
    "it_s" : "input_total_satoshi",
    "ft_s" : "fee_total_satoshi",
    "cr_b" : "currency_rate_bitcoin",
    "size" : "size",
    "inpc" : "input_count",
    "outc" : "output_count",
    "trnr" : "transaction_number"
*/

// available values for y axis
//allY = ['cr_b','ft_s'] ;
//allY = ['cr_b','ft_s','it_s','size','inpc','outc','trnr'] ;
allY = ['currency_rate_bitcoin','fee_total_satoshi','input_total_satoshi','size','input_count','output_count','transaction_number'] ;

// data initialization
{
  document.querySelector('.filter--StartDate').value = formatDate(startDate);
  document.querySelector('.filter--EndDate').value = formatDate(endDate);
  createSelectOptions(allX,'.filters--xaxis',xaxis) ;
  //createSelectOptions(allY,'.filters--series') ;
  //it is neccesery for comments to work
  for(let element = 0;element<yaxis.length;element++ ){
   createSelectOptions(allY,'.filters--series',yaxis[element]);
  }
}

function createValueArray(HTMLcollection){
  let outArray=[] ;
  for (const element of HTMLcollection){
    outArray.push(element.value) ;
  }
  return outArray ;
}

function deduplicate(inArray){
  let _dups = [] ;
  let _nodups = [] ;
  let _previndex = [] ;
  for( let i=0; i<inArray.length; i++){
    if(_previndex.includes(inArray[i])){
      _dups.push(inArray[i]) ;
      continue ;
    }
    else {
      _nodups.push(inArray[i]) ;
    }
    _previndex.push(inArray[i]);
  }
  return _nodups ;
}

function saveComment(){
  comment=[];
  comment.push(document.getElementById('comment--title').value);
  comment.push(document.getElementById('comment--description').value);
  comment.push(formatDate(startDate));
  comment.push(formatDate(endDate));
  comment.push(xaxis);
  comment.push(yaxis);
  let result = "/save"+JSON.stringify(comment);
  fetch(result).then( (respond) => 
  {
    if(respond.statusText=="OK"){
      document.getElementById("comment--save").innerHTML = "Sikeresen mentve!";
    }else{
      document.getElementById("comment--save").innerHTML = "Mentési kísérlet sikertelen!!";
    }
  });
}

function getData(){
  document.getElementById("data").innerHTML  = "Start getting data";  
  start = formatDate(startDate);
  end = formatDate(endDate);

  // query selected xaxis values
  let xaxisselection = document.querySelector('.filters--xaxis').getElementsByTagName('select') ;
  xaxis = createValueArray(xaxisselection) ;

  // query selected yaxis values and overwrite
  let yaxisselection = document.querySelector('.filters--series').getElementsByTagName('select') ;
  yaxisselection = createValueArray(yaxisselection) ;
  yaxis = deduplicate(yaxisselection) ;
  let normalisation = document.getElementById("normalization").checked;

  let url = "/testGet/"+start+"&"+end+"&"+xaxis+"&"+JSON.stringify(yaxis)+"&"+normalisation ;
  fetch(url)
  .then((data) => { return data.json() })
  .then((data) => processData(data))
  .then((data) => loadDescriptives(data)) 
  .then((data) => loadCorrelations(data)) 
  ;
}

function loadDescriptives(dataIn){

  // 2nd part is analytics
  let data = dataIn[1] ;
  
  let analytics = document.getElementById('analytics') ;

  // clear table
  while(analytics.childNodes.length > 2){
    analytics.removeChild(analytics.lastChild);
  }

  // count of select = count of rows to be added
  let yselection = document.querySelector('.filters--series').getElementsByTagName('select') ;
  yselection = createValueArray(yselection) ;
  yselection = deduplicate(yselection) ;

  // create placeholders
  for (let i=0 ; i < yselection.length; i++){
    
    // create new row
    let tr = document.createElement('tr') ;

    // create and load cells
    for (let d=0 ; d < 3; d++){
      let td = document.createElement('td') ;
      if(d==0){
        td.innerHTML=yselection[i] ; //.value ; // add name in 1st column
      }
      else {
        td.innerHTML = data[i][d-1].toFixed(4);
      }
      tr.appendChild(td) ;
    }
  
    // add to filter series
    analytics.appendChild(tr) ;
  }

  return dataIn ;
}


function loadCorrelations(dataIn){
  let data = dataIn[2] ;

  let correlations = document.getElementById('correlations') ;

  // clear table
  while(correlations.childNodes.length > 1){
    correlations.removeChild(correlations.lastChild);
  }

  // count of select = count of rows to be added
  let yselection = document.querySelector('.filters--series').getElementsByTagName('select') ;
  let xyselection = document.querySelector('.filters--xaxis').getElementsByTagName('select') ;

  yselection = createValueArray(yselection) ;
  yselection = deduplicate(yselection) ;
  xyselection = createValueArray(xyselection) ;
  xyselection = deduplicate(xyselection) ;

  for (let i=0; i < yselection.length; i++){
    xyselection.push(yselection[i]) ;
  } 

  xyselection = deduplicate(xyselection) ;

  // create table header
  let thead = document.createElement('tr') ;
  let th = document.createElement('th') ; 
  thead.appendChild(th) ;

  for (let i=0 ; i < xyselection.length; i++){
    let th = document.createElement('th') ; 
    th.innerHTML = xyselection[i] ;
    thead.appendChild(th) ;
  }
  correlations.appendChild(thead) ;

  // create placeholders
  for (let i=0 ; i < xyselection.length; i++){

    // create new row
    let tr = document.createElement('tr') ;
    
    // create and load cells
    for (let d=0 ; d <= xyselection.length; d++){
      let td = document.createElement('td') ;
      if(d==0){
        td.innerHTML = data[i][d];
      }else{
        td.innerHTML = data[i][d].toFixed(4);
      }
      tr.appendChild(td) ;
    }
    
    // add to filter series
    correlations.appendChild(tr) ;
  }

  return dataIn ;
}


function processData(dataIn){

  // 1st part is chartData
  let data = JSON.parse(dataIn[0]) ;

  chartData = data ;
  document.getElementById("data").innerHTML = "Data succesfully gathered";
  createChartData=[];

  for(let i=1 ; i<data.length;i++){
    tmpdata=[];
    for(let j=0; j<100;j++){
      tmpdata[j] = {x:data[0][j],y:data[i][j]}
    }
    createChartData[i-1] = {name:yaxis[i-1],data:tmpdata};
  }
  createChart();

  return dataIn ;
}

function formatDate(date) {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

  return [year, month, day].join('-');
}

function createChart(){
  if(chart){
  chart.destroy();
}
  if(chartLine){  
  chartLine.destroy();
  }
  let min = chartData[1][0];
  let max = chartData[1][0];

  for(let i=1;i<chartData.length;i++){
    let tmpmin = Math.min.apply(null, chartData[i]);
    let tmpmax = Math.max.apply(null, chartData[i]);
    min = min<tmpmin? min: tmpmin;
    max = max<tmpmax? tmpmax: max;
  }
  let rotate = xaxis == "time"? -70:0;
  let percnt = document.getElementById("normalization").checked? "%" : "" ;
var options = {
  series: 
    createChartData
  ,
  chart: {
  id: 'chart2',
  type: 'line',
  height: 350,
  toolbar: {
    autoSelected: 'pan',
    show: false
  }
},
stroke: {
  width: 3
},
dataLabels: {
  enabled: false
},
markers: {
  size: 0
},
legend:{
  labels:{
    colors: '#FFFFFF'
  }
},
yaxis: {
  labels: {
    style: {
      fontSize: '12px',
      fontWeight: 400,
      fontFamily: 'Open Sans',
      colors: ['#FFFFFF'],
    },
    formatter: function(val) {
      return val.toFixed(2)+percnt;
    }
  },
  min:min,
  max:max
},
xaxis: {
  labels:{
    rotate:rotate,
    style:{
      fontSize: '12px',
      fontWeight: 400,
      fontFamily: 'Open Sans',
      colors: '#FFFFFF'
    }
  },
  data: chartData[0],
  type: 'number',
  tickAmount:20,
}
};

chart = new ApexCharts(document.querySelector("#chart-line2"), options);
chart.render();

var optionsLine = {
  series: createChartData,
  chart: {
  id: 'chart1',
  height: 200,
  type: 'area',
  brush:{
    target: 'chart2',
    enabled: true
  },
  selection: {
    enabled: true,
    xaxis: {
      min: chartData[0][0],
      max: chartData[0][99]
    }
  },
},
fill: {
  type: 'gradient',
  gradient: {
    opacityFrom: 0.91,
    opacityTo: 0.1,
  }
},
legend:{
  labels:{
    colors: '#FFFFFF'
  }
},
xaxis: {
  tooltip: {
    enabled: true
  },
  labels:{
    rotate:rotate,
    style:{
      fontSize: '12px',
      fontWeight: 400,
      fontFamily: 'Open Sans',
      colors: '#FFFFFF'
    }
  },
  tickAmount:20,
  
},
yaxis: {
  tickAmount: 2,
  labels: {
    style: {
      fontSize: '12px',
      fontWeight: 400,
      fontFamily: 'Open Sans',
      colors: ['#FFFFFF'],
    },
    formatter: function(val) {
      return val.toFixed(2)+percnt;
    }
  },
  max:max,
  min:min,
}
};

chartLine = new ApexCharts(document.querySelector("#chart-line"), optionsLine);
chartLine.render();
}

// custom functions ---------------------------------------------------------------------

// display message
const displayMessage = function (message) {
  document.getElementById("data").innerHTML = message;
};

// create filter--series select options
function createSelectOptions(yaxis, target, selected){
  let selectoptions = [...yaxis] ;
  selected = selected ? selected:selectoptions[0];
  // create new element
  let sel = document.createElement('select') ;
    
  // load content / add new element
  for (optitem in selectoptions){
    let opt = document.createElement('option') ;
    opt.value = selectoptions[optitem] ;
    opt.innerHTML = selectoptions[optitem] ;
    sel.appendChild(opt)
  }
  
  sel.value = selected;
  // add to filter series
  document.querySelector(target).appendChild(sel) ;
}
// EventListeners -----------------------------------------------------------------------

// Send ---------------------------------------------------------------------------------
// Function: initiate data collection with specified filters
document.querySelector('.btn--send').addEventListener('click', function () {

  let _tmp_startDate = new Date(document.querySelector('.filter--StartDate').value);
  let _tmp_endDate = new Date(document.querySelector('.filter--EndDate').value);

  if(_tmp_startDate.getTime() > _tmp_endDate.getTime()) {
    displayMessage('Start date must be earlier than end date...') ;
  } else {
    startDate = document.querySelector('.filter--StartDate').value;
    endDate = document.querySelector('.filter--EndDate').value;
    getData();
  }
});

// Add ----------------------------------------------------------------------------------
// Function: new select field for data series
document.querySelector('.btn--add').addEventListener('click', function() {
  // already existing select elements
  let HTMLselects = document.getElementsByTagName("select").length ;

  // only add select element if additional data can be added
  if(HTMLselects <= allY.length){
    
    createSelectOptions(allY, '.filters--series')
    
  } else {
    // new element cannot be added
    alert(`cannot add more than ${allY.length} selection`)
  }
});

// Remove -------------------------------------------------------------------------------
// Function: deletes last select field for data series
document.querySelector('.btn--remove').addEventListener('click', function() {
  
  let selectElement = document.querySelector('.filters--series') ;
  if( selectElement.childElementCount > 1 ){
    selectElement.removeChild(selectElement.lastChild);
  }

}) ;

//if the page is loaded from comments, then load graph instantly 
if (load == "y"){
  getData();
}