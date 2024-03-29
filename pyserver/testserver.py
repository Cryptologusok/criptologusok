from ctypes import sizeof
from flask import Flask, render_template, request 
import services.test as testfile
import json
from services.bi import getChartData
from datetime import datetime
from os.path import exists


app = Flask(__name__)

@app.route("/")
def index():
    y=["currency_rate_bitcoin"]
    ylength = len(y)
    return render_template("background/background.html", main="index/index.html", xaxis="time", ylen=ylength, yaxis=y, startDate="2014/05/13", endDate="2022/09/15", load="n")

@app.route("/<start>&<end>&<x>&<y>")
def indexdata(start,end,x,y):
    y = y.replace("'","\"")
    y = json.loads(y.strip())
    ylength = len(y)
    return render_template("background/background.html", main="index/index.html", xaxis=x, ylen=ylength, yaxis=y, startDate=start, endDate=end, load="y")
     

@app.route("/test")
def test():
    alma= testfile.getTestString()
    return render_template("background/background.html", main="index/index.html",content=alma, words=["This ", "is ", "how ", "you ", "pass ", "an ", "array."])

@app.route("/other")
def other():
    return render_template("background/background.html", main="another/another.html")

@app.route("/impressum")
def impressum():
    return render_template("background/background.html", main="another/Impressum.html")


@app.route("/save",methods=['POST'])
def save():
    if exists("comments.txt"):
        file = open("comments.txt","r")
    else:
        file = open("pyserver/comments.txt","r")

    result_tmp = str(request.json) + "\n"+ file.read()
    result = result_tmp.replace("\'","\"")
    result_tmp
    result_tmp = result.replace("\\n"," ")
    result = result_tmp
    del result_tmp
    file.close()
    if exists("comments.txt"):
        file = open("comments.txt","w")
    else:
        file = open("pyserver/comments.txt","w")
    file.write(result)
    file.close()
    return "Sikeresen Mentve"

@app.route("/comments")
def comment():
    if exists("comments.txt"):
        file = open("comments.txt","r")
    else:
        file = open("pyserver/comments.txt","r")
    comments = []

    line = file.readline()
    while line != "":
        comments.append(json.loads(line.strip())) 
        line = file.readline()

    comments = json.dumps(comments)
    return render_template("background/background.html", main="comments/comments.html", yeay=comments)    

@app.route("/testGet/<startDate>&<endDate>&<xaxis>&<yaxis>&<normalization>")
def testGet(startDate,endDate,xaxis,yaxis,normalization):
    yaxis = yaxis[1:-1].split(',') # convert datas
    for item in range(len(yaxis)):
        yaxis[item] = yaxis[item].strip("\"")
    startDate = datetime.strptime(startDate,"%Y-%m-%d")
    endDate = datetime.strptime(endDate,"%Y-%m-%d")
    return getChartData(startDate,endDate,xaxis,yaxis,normalization)


if __name__ == "__main__":
    if not exists("comments.txt") and not exists("pyserver/comments.txt"):
        open("comments.txt", "a")
    app.run(host="localhost",port=80,debug=True)