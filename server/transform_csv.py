import glob
import pandas as pd
import os
import sys


#
# Transforms csv files from to_transform folder into the format 
# used by the app for a given as an argument school
#
def main(school):
    if not os.path.exists("to_transform/"):
        return
    
    os.makedirs(f"csv/{school}/", exist_ok=True)

    for file in glob.glob("to_transform/*"):
        df = pd.read_csv(file)

        new_df = df.filter(items=["Subject", "Course", "Primary Instructor", "F", "W"]).rename(columns={"Subject": "CRS SUBJ CD", "Course": "CRS NBR"})

        for letter in ["A", "B", "C", "D"]:
            new_df[letter] = df.filter(regex=f"^{letter}.?$").sum(axis=1)

        new_df = new_df.reindex(columns=["CRS SUBJ CD", "CRS NBR", "A", "B", "C", "D", "F", "W", "Primary Instructor"])
        new_df.to_csv(f"csv/{school}/{file.split('/')[1]}", index=False)


if __name__ == "__main__":
    main(sys.argv[1])