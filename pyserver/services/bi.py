import random
import json
from services.de import getData
import pandas as pd
from datetime import datetime

def getChartData(startDate,endDate,xaxis,yaxis,normalization):
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
    dfanalytics = df
    if xaxis == 'time':
        dfanalytics['time'].apply(lambda x: datetime.strptime(x[:x.find(".")],'%Y-%m-%d %H:%M:%S').timestamp())

    # generate descriptive stats
    analytics = []

    i = 0 
    for y in yaxis:
        analytics.append([]) # create placeholders
        analytics[i].append(dfanalytics[y].median()) # median
        analytics[i].append(dfanalytics[y].std()) # stdev #df[y].iloc[:,0]
        i += 1

    # generate correlation matrix
    corrMatrixCols = yaxis.copy()
    corrMatrixCols.insert(0, xaxis)
    corrmatrix = dfanalytics[corrMatrixCols].corr()
    
    listcorrmatrix = []
    time = dfanalytics["time"].values.flatten()

    for row in corrmatrix.itertuples():
        listcorrmatrix.append(list(row))

    if normalization == "true":
        #df=(df-df.min())/(((df.max()-df.min())/100))
        chartData = df.T.values[1:-1].tolist()
        for index in range(1,len(chartData)):
            minimal = min(chartData[index])
            minmaxdif = max(chartData[index])
            for jindex in range(len(chartData[0])):
                chartData[index][jindex] = (chartData[index][jindex]-minimal)/((minmaxdif-minimal)/100)
    else:
        chartData = df.T.values[1:-1].tolist()
    # generate chart data
    # chartData = [[]]

    # for i in range(100):
    #     chartData[0].append(data[i][1])

    # for i in range(len(yaxis)):
    #     chartData.append([])

    #     for j in range(100):
    #         chartData[i+1].append(data[j][i+2])

    output = []
    output.append(json.dumps(chartData))
    output.append(analytics)
    output.append(listcorrmatrix)

    #print(json.dumps(output))

    return json.dumps(output)
