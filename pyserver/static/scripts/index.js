//declare global variables

let xaxis = "bloc"
let yaxis = ["cr_b","ft_s"];
let startDate = new Date('2014/05/13');
let endDate = new Date('2022/09/15');
let chart;
let chartLine;
let chartData;
let createChartData;

function getData(){
  document.getElementById("data").innerHTML  = "Start getting data";  
  let url = "/testGet/"+startDate.toLocaleDateString()+"&"+endDate.toLocaleDateString()+"&"+xaxis+"&"+JSON.stringify(yaxis);
  fetch(url).then((data) => {return data.json()})
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

getData();