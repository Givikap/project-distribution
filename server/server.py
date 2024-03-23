from flask import Flask, jsonify, request
from flask_cors import CORS
import pymongo
from pymongo import MongoClient


app = Flask(__name__)
cors = CORS(app, origins="*")

cluster = MongoClient("mongodb+srv://kaitosekiya:Gala5789kap!@uncommonhacks.f6n9ibs.mongodb.net/?retryWrites=true&w=majority&appName=UncommonHacks")