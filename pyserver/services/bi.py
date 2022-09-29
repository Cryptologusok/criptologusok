import imp
import random
import json
from services.de import getMinMax, getYaxisData

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
    (min, max) = getMinMax(startDate,endDate,xaxis)
    #adatfelosztás 100 részre
    #[50,51,52,53,54..150] ebbe az esetbe
    data = getYaxisData(startDate,endDate,xaxis,yaxis)
    #lecsekkolod hogy az x melyik 100 kis részhez van legközelebb és az annak megfelelő indexbe berakod az y adatokat
    #retunöölöd a készített cuccot
    #[[x adatok 100 elem][y1 adatok 100 elem][y2..y adatok 100 elem]]
