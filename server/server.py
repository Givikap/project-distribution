from flask import Flask, jsonify, request
from flask_cors import CORS
import pymongo
from pymongo import MongoClient
import json
import pandas as pd


app = Flask(__name__)
cors = CORS(app, origins='*')

# cluster = MongoClient("mongodb+srv://kaitosekiya:Gala5789kap!@uncommonhacks.f6n9ibs.mongodb.net/?retryWrites=true&w=majority&appName=UncommonHacks")

data = json.load(open('json/data.json'))


@app.route('/api/courses', methods=['GET'])
def courses():
    return jsonify(data["courses"])


@app.route('/api/semesters', methods=['GET'])
def semesters():
    return jsonify(data["semesters"])


@app.route('/api/plot/<course_name>/<course_number>/<semester>', methods=['GET'])
def plot(course_name:str, course_number, semester:str):
    df = pd.read_csv(f"csv/{semester}.csv")
    
    df = df[df["CRS SUBJ CD"] == course_name.upper()]
    df = df[df["CRS NBR"] == int(course_number)].filter(items=["A", "B", "C", "D", "F", "I", "W", "Primary Instructor"])

    print(df)

    return jsonify()


if __name__ == "__main__":
    app.run(debug=True, port=8080)