from flask import Flask, redirect, render_template, url_for

app = Flask(__name__)

@app.route("/")
def index():
    alma="This is test data passed to htmls"
    return render_template("background/background.html", main="index/index.html", content=alma, words=["This ", "is ", "how ", "you ", "pass ", "an ", "array."])
     

@app.route("/test")
def test():
    alma="This is the test page, hy"
    return render_template("background/background.html", main="index/index.html",content=alma, words=["This ", "is ", "how ", "you ", "pass ", "an ", "array."])

@app.route("/other")
def other():
    return render_template("background/background.html", main="another/another.html")


if __name__ == "__main__":
    app.run(host="localhost",port=42069,debug=True)