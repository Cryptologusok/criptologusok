import imp
import random
import json
from services.de import getData

def dummy_getChart(startDate,endDate,xaxis,yaxis):
    chartData = [[]]
    
    for index in range(100):
        chartData[0].append((index+1)*10)
    for index in range(len(yaxis)):
        chartData.append([])
        number = 1 
        for inner in range(100):
            number += 10*random.randint(1,10)
            number -= 10*random.randint(1,10)           
            chartData[index+1].append(number)

    
    print(chartData)

    return json.dumps(chartData)

def getChartData(startDate,endDate,xaxis,yaxis):
    data = getData(startDate,endDate,xaxis,yaxis)
    chartData = [[]]

    for i in range(100):
        chartData[0].append(data[1][i])

    for i in range(len(yaxis)):
        chartData.append([])

        for j in range(100):
            chartData[i+1] = data[i+2][j]

    return json.dumps(chartData)
