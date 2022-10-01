from flask import Flask, render_template 
import services.test as testfile
import json
from services.bi import getChartData
from datetime import datetime


app = Flask(__name__)

@app.route("/")
def index():
    alma="This is test data passed to htmls"
    return render_template("background/background.html", main="index/index.html", content=alma, words=["This ", "is ", "how ", "you ", "pass ", "an ", "array."])
     

@app.route("/test")
def test():
    alma= testfile.getTestString()
    return render_template("background/background.html", main="index/index.html",content=alma, words=["This ", "is ", "how ", "you ", "pass ", "an ", "array."])

@app.route("/other")
def other():
    return render_template("background/background.html", main="another/another.html")

@app.route("/comments")
def comment():
    return render_template("background/background.html", main="comments/comments.html")    

@app.route("/testGet/<startDate>&<endDate>&<xaxis>&<yaxis>")
def testGet(startDate,endDate,xaxis,yaxis):
    yaxis = yaxis[1:-1].split(',') # convert datas
    for item in range(len(yaxis)):
        yaxis[item] = yaxis[item].strip("\"")
    startDate = datetime.strptime(startDate,"%Y. %m. %d.")
    endDate = datetime.strptime(endDate,"%Y. %m. %d.")
    return getChartData(startDate,endDate,xaxis,yaxis)


if __name__ == "__main__":
    app.run(host="localhost",port=80,debug=True)