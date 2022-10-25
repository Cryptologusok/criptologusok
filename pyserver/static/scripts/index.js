//declare global variables
let chart;
let chartLine;
let chartData;
let createChartData;


document.querySelector('.filter--StartDate').value = formatDate(startDate);
document.querySelector('.filter--EndDate').value = formatDate(endDate);

function getData(){
  document.getElementById("data").innerHTML  = "Start getting data";  
  start = formatDate(startDate);
  end = formatDate(endDate);
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

/* custom functions */
const displayMessage = function (message) {
  document.getElementById("data").innerHTML = message;
};

/* EventListeners */
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

document.querySelector('.btn--add').addEventListener('click', function() {
  
  // available options
  let selectoptions = ['cr_b','ft_s'] ;

  // already existing select elements - number of selections for dates
  let HTMLselects = document.getElementsByTagName("select").length ;

  // only add select element if additional data can be added
  if(HTMLselects < selectoptions.length){
    
    // create new element
    let sel = document.createElement('select') ;
    
    // create / add new element
    for (optitem in selectoptions){
      let opt = document.createElement('option') ;
      opt.value = selectoptions[optitem] ;
      opt.innerHTML = selectoptions[optitem] ;
      sel.appendChild(opt)
    }

    document.querySelector('.filters--series').appendChild(document.createElement('br'))
    document.querySelector('.filters--series').appendChild(sel) ;
    
  } else {
    // new element cannot be added
    alert(`cannot add more than ${selectoptions.length} selection`)
  }
});

if (load == "y"){
  getData();
}