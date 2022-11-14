import random
import json
from services.de import getData
import pandas as pd

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
    data = getData( 
        startDate.strftime("%Y-%m-%d %H:%m:%S"),
        endDate.strftime("%Y-%m-%d %H:%m:%S"),
        xaxis,yaxis)

    # generate names for df
    __names = []
    __names.append('bucket')
    __names.append(xaxis)
    for y in yaxis:
        __names.append(y)
    __names.append('trnr')

    # generate dataframe for descriptive stats
    df = pd.DataFrame(data, columns=__names)

    # generate descriptive stats
    analytics = []

    i = 0 
    for y in yaxis:
        analytics.append([]) # create placeholders
        analytics[i].append(df[y].median()) # median
        analytics[i].append(df[y].std()) # stdev
        i += 1

    # generate correlation matrix
    corrmatrix = df[yaxis].corr()
    
    listcorrmatrix = []

    for row in corrmatrix.itertuples():
        listcorrmatrix.append(list(row))

    # generate chart data
    chartData = [[]]

    for i in range(100):
        chartData[0].append(data[i][1])

    for i in range(len(yaxis)):
        chartData.append([])

        for j in range(100):
            chartData[i+1].append(data[j][i+2])

    output = []
    output.append(json.dumps(chartData))
    output.append(analytics)
    output.append(listcorrmatrix)

    #print(json.dumps(output))

    return json.dumps(output)
