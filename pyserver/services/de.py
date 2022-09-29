import random

def getMinMax(startDate,endDate,xaxist):
    min=50
    max=150
    return (min,max)

def getYaxisData(startDate,endDate,xaxis,yaxis):
    resoult = [[]]
    for i in range(len(yaxis)):
        resoult.append([])
    for i in range(1000):
        resoult[0] = random.randint(50,150)
        for j in range(len(yaxis)):
            resoult[j+1] = random.randint(0,100000)
    return resoult
    #[x,y1,y2,y3..y]