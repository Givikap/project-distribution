import os
import math
from flask import Flask, jsonify, send_file
from flask_cors import CORS
import json
import pandas as pd
import matplotlib.pyplot as plt
from matplotlib.figure import Figure
import seaborn as sns


app = Flask(__name__)
cors = CORS(app, origins="*")

data = json.load(open("json/data.json"))


@app.route("/api/schools", methods=["GET"])
def schools():
    return jsonify(data["schools"])


@app.route("/api/courses/<school>", methods=["GET"])
def courses(school):
    return jsonify(data["courses"][school])


@app.route("/api/semesters/<school>", methods=["GET"])
def semesters(school):
    return jsonify(data["semesters"][school])


@app.route("/api/schools_codes", methods=["GET"])
def schools_codes():
    return jsonify(data["schools_to_codes"])


@app.route("/api/semesters_codes", methods=["GET"])
def semesters_codes():
    return jsonify(data["semesters_to_codes"])


@app.route("/api/instructors/<school>/<semester>/<course_name>/<course_number>", methods=["GET"])
def instructors(school, semester, course_name, course_number):
    plots_path = f"plots/{school}/{semester}/{course_name.lower()}/{course_number}/"

    if not os.path.exists(plots_path):
        search_df = pd.read_csv(f"csv/{school}/{semester}.csv")

        search_df = search_df[search_df["CRS SUBJ CD"] == course_name]

        if search_df.empty:
            return jsonify(instructors={}, message="Such subject is not offered this semester")
        
        search_df = search_df[search_df["CRS NBR"] == int(course_number)].filter(items=["A", "B", "C", "D", "F", "I", "W", "Primary Instructor"]).set_index("Primary Instructor")

        if search_df.empty:
            return jsonify(instructors={}, message="Such course is not offered this semester or does not exist")

        instructors = {}

        max_percent = 0.0

        for _, row in search_df.iterrows():
            total = row.sum()
            row = row / total * 100

            max_percent = max(max_percent, row.max())

        for index, (instructor, row) in enumerate(search_df.iterrows()):
            fig = Figure()
            ax = fig.subplots()

            count_df = pd.DataFrame(row).rename(columns={instructor: "Count"})
            count_df["Percent"] = count_df["Count"] / count_df["Count"].sum() * 100

            sns.barplot(count_df["Percent"], ax=ax)

            bars_labels = count_df["Count"].astype("str") + "\n"+ count_df["Percent"].round(1).astype("str") + "%"

            for i, (value, label) in enumerate(zip(count_df["Percent"], bars_labels)):
                ax.text(i, value, label, ha="center", va="bottom")

            for bar, color in zip(ax.patches, data["palette"]):
                bar.set_facecolor(color)

            ax.set_xlabel(None) 
            ax.set_ylabel(None)

            ax.set_ylim(0, math.ceil(max_percent / 5) * 5)

            ax.spines["top"].set_visible(False)
            ax.spines["right"].set_visible(False)
            ax.spines["bottom"].set_visible(False)
             
            fig.tight_layout()

            plot_path = f"{plots_path}{index}.png"

            instructors[instructor] = plot_path

            os.makedirs(plots_path, exist_ok=True)
            fig.savefig(plot_path, format="png")
            plt.close()

        with open(plots_path + "instructors.json", "w") as json_file:
            json.dump(instructors, json_file, indent=4)

    return jsonify(instructors=json.load(open(f"{plots_path}instructors.json")), message="")


@app.route("/api/plot/<path:subpath>", methods=["GET"])
def plot(subpath):
    return send_file(subpath.lower())

        
if __name__ == "__main__":
    app.run(debug=True, port=8080)