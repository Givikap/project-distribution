import os
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
import json
import pandas as pd
import matplotlib.pyplot as plt
from matplotlib.figure import Figure
import seaborn as sns


app = Flask(__name__)
cors = CORS(app, origins="*")

data = json.load(open("json/data.json"))


@app.route("/api/courses", methods=["GET"])
def courses():
    return jsonify(data["courses"])


@app.route("/api/semesters", methods=["GET"])
def semesters():
    return jsonify(data["semesters"])


@app.route("/api/codes", methods=["GET"])
def codes():
    return jsonify(data["semesters_to_codes"])


@app.route("/api/get_plot/<path:subpath><string:filename>", methods=["GET"])
def get_plot(subpath, filename):
    return send_from_directory("plots/" + subpath, filename)


@app.route("/api/plot/<semester>/<course_name>/<course_number>", methods=["GET"])
def plot(semester, course_name, course_number):
    plot_path = f"plots/{semester}/{course_name}/{course_number}/"

    print(plot_path)

    if not os.path.exists(plot_path):
        df = pd.read_csv(f"csv/{semester}.csv")
        
        df = df[df["CRS SUBJ CD"] == course_name.upper()]

        if df.empty:
            return jsonify(instructors={}, message="subject")
        
        df = df[df["CRS NBR"] == int(course_number)].filter(items=["A", "B", "C", "D", "F", "I", "W", "Primary Instructor"]).set_index("Primary Instructor")

        if df.empty:
            return jsonify(instructors={}, message="number")

        instructors = {}

        for index, (instructor, row) in enumerate(df.iterrows()):
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

            ax.spines["top"].set_visible(False)
            ax.spines["right"].set_visible(False)
            ax.spines["bottom"].set_visible(False)
             
            fig.tight_layout()

            file_name = f"{index}.png"

            instructors[instructor] = file_name

            os.makedirs(plot_path, exist_ok=True)
            fig.savefig(plot_path + file_name, format="png")
            plt.close()

        with open(plot_path + "instructors.json", "w") as json_file:
            json.dump(instructors, json_file, indent=4)

    return jsonify(instructors=json.load(open(f"{plot_path}instructors.json")), message="")

        
if __name__ == "__main__":
    app.run(debug=True, port=8080)