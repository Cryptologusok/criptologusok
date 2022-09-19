from flask import Flask, redirect, render_template, url_for
import services.test as testfile


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


if __name__ == "__main__":
    app.run(host="localhost",port=80,debug=True)