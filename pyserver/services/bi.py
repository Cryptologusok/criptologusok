import random
import json

def dummy_getChart(startDate,endDate,xaxis,yaxis):
    chartData = [[]]
    
    for index in range(100):
        chartData[0].append((index+1)*10)
    for index in range(len(yaxis)):
        chartData.append([])
        for inner in range(100):
            chartData[index+1].append(random.randint(0,1000))

    
    print(chartData)

    return json.dumps(chartData)