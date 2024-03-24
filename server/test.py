import os
import json
import glob
import pandas as pd


courses = pd.Series()


for file in glob.glob(os.path.join("csv/", '*')):
    df = pd.read_csv(file)

    courses = pd.concat([courses, df["CRS SUBJ CD"]])
    courses.drop_duplicates(inplace=True)

print(json.dumps(sorted(courses.tolist())))

# {Papakonstantinou, Zinon: "plots/fa23/hist/202/0.png"}
