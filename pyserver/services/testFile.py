#temporary data generation
import random
import datetime
from services.de import getMinMax, getYaxisData
import json


def randTest():     
    randomDatebase = [[],[],[],[]]
    for i in range(1):
        #start date
        year = random.randint(2000,2022)
        month = random.randint(1,12)
        day = random.randint(1,28)
        hour = random.randint(0,23)
        minute = random.randint(0,40)
        time = datetime.datetime(year, month, day, hour, minute)
        randomDatebase[0].append(time)

        #end date
        time = datetime.datetime(year, month, day, hour, minute + 10)
        randomDatebase[1].append(time)

        #fee
        randomDatebase[3].append("fee")
        randomDatebase[3].append("blockID")

    return randomDatebase

#function
def getGraphData(startDate,endDate,xaxis,yaxis):
    graphData = [[]]
    
    for i in range(len(yaxis)):
        graphData.append([])

    (min,max) = getMinMax(startDate, endDate, xaxis)

    distance = (max-min)/100

    print(min, max, distance, len(yaxis))
    print("yaxsis:",yaxis)
    print(graphData)
    return json.dumps(graphData)


#function 2
def getChartData2(startDate,endDate,xaxis,yaxis):
    (min, max) = getMinMax(startDate,endDate,xaxis)

    distance = (max-min)/100
    for i in range(100):
        
        print(i*distance+min)

    data = getYaxisData(startDate,endDate,xaxis,yaxis)
    return


#main
#randTest()
#getChartData(randomDatebase[0][0], randomDatebase[1][0], "szoveg", randomDatebase[2][0])
#for i in range(100):
#    getGraphData(randomDatebase[0][i], randomDatebase[1][i], "szoveg", randomDatebase[3][i])