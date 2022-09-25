import random
import json

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