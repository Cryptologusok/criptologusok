from flask import Flask, redirect, render_template, url_for

app = Flask(__name__)

@app.route("/")
def index():
    alma="This is test data passed to htmls"
    return render_template("index.html", content=alma, words=["This ", "is ", "how ", "you ", "pass ", "an ", "array."])  

@app.route("/trap")
def trap():
    return redirect(url_for("treasure"))

@app.route("/treasure")
def treasure():
    return redirect(url_for("trap"))

if __name__ == "__main__":
    app.run(debug=True)