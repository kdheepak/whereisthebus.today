from __future__ import absolute_import
import os
import json
import traceback

from flask import Flask, request, render_template

import logging

logger = logging.getLogger('app')
hdlr = logging.FileHandler(os.path.join(__file__, 'logger.log'))
formatter = logging.Formatter('%(asctime)s %(levelname)s %(message)s')
hdlr.setFormatter(formatter)
logger.addHandler(hdlr)
logger.setLevel(logging.DEBUG)

app = Flask(__name__, template_folder="./templates",
            static_url_path="/static",
            static_folder="./static")


@app.route("/")
def index():
    return render_template('index.html')


@app.route("/about.html")
def about():
    return render_template('about.html')


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=8080)
