//declare global variables
let chart;
let chartLine;
let chartData;
let createChartData;

// available values for x axis
allX = ['bloc','cr_b','ft_s'] ; 

// available values for y axis
allY = ['cr_b','ft_s'] ;
//allY = ['cr_b','ft_s','it_s','size','inpc','outc'] ;

// data initialization
{
  document.querySelector('.filter--StartDate').value = formatDate(startDate);
  document.querySelector('.filter--EndDate').value = formatDate(endDate);
  createSelectOptions(allX,'.filters--xaxis') ;
  createSelectOptions(allY,'.filters--series') ;
}


<<<<<<< HEAD
function saveComment(){
  comment=[];
  comment.push(document.getElementById('comment--title').value);
  comment.push(document.getElementById('comment--description').value);
  comment.push(formatDate(startDate));
  comment.push(formatDate(endDate));
  comment.push(xaxis);
  comment.push(yaxis);
  let result = "/save"+JSON.stringify(comment);
  fetch(result);
  console.log(result);
}

=======
>>>>>>> 299793ec32a1fe55ac9f59686aa9ac728476bc6c
function getData(){
  document.getElementById("data").innerHTML  = "Start getting data";  
  start = formatDate(startDate);
  end = formatDate(endDate);

  // query selected xaxis values
  let xaxisselection=[] ;
  let xselects = document.querySelector('.filters--xaxis').getElementsByTagName('select') ;
  for (const select of xselects){
    xaxisselection.push(select.value) ;
  }
  xaxis = xaxisselection ;

  // query selected yaxis values and overwrite
  let yaxisselection=[] ;
  let yselects = document.querySelector('.filters--series').getElementsByTagName('select') ;
  for (const select of yselects){
    yaxisselection.push(select.value) ;
  }
  yaxis = yaxisselection ;

  let url = "/testGet/"+start+"&"+end+"&"+xaxis+"&"+JSON.stringify(yaxis);
  fetch(url)
  .then((data) => {return data.json()})
  .then((data) => processData(data));
}

function processData(data){
  chartData = data;
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
var options = {
  series: 
    createChartData
  ,
  chart: {
  id: 'chart2',
  type: 'line',
  height: 400,
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
fill: {
  opacity: 1,
},
markers: {
  size: 0
},
xaxis: {
  data: chartData[0],
  type: 'number'
}
};

chart = new ApexCharts(document.querySelector("#chart-line2"), options);
chart.render();

var optionsLine = {
  series: createChartData,
  chart: {
  id: 'chart1',
  height: 300,
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
xaxis: {
  type: 'number',
  tooltip: {
    enabled: true
  }
},
yaxis: {
  tickAmount: 2
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
function createSelectOptions(yaxis, target){
  let selectoptions = [...yaxis] ;

  // create new element
  let sel = document.createElement('select') ;
    
  // load content / add new element
  for (optitem in selectoptions){
    let opt = document.createElement('option') ;
    opt.value = selectoptions[optitem] ;
    opt.innerHTML = selectoptions[optitem] ;
    sel.appendChild(opt)
  }

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
  selectElement.removeChild(selectElement.lastChild);

}) ;

//if the page is loaded from comments, then load graph instantly 
if (load == "y"){
  getData();
}