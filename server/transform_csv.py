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
        df = pd.read_csv(file, encoding_errors="ignore")

        new_df = df.rename(columns={
            "Subject": "CRS SUBJ CD", 
            "Course": "CRS NBR", 
            "Course Subject": "CRS SUBJ CD", 
            "Course Number": "CRS NBR"
            }).filter(items=["CRS SUBJ CD", "CRS NBR", "Primary Instructor", "F", "W"])
    
        for letter in ["A", "B", "C", "D"]:
            new_df[letter] = df.filter(regex=f"^{letter}.?$").sum(axis=1).astype(int)

        new_df = new_df.reindex(columns=["CRS SUBJ CD", "CRS NBR", "A", "B", "C", "D", "F", "W", "Primary Instructor"]).dropna(subset=["A", "B", "C", "D", "F", "W"])

        new_df["F"] = new_df["F"].astype(int)
        new_df["W"] = new_df["W"].astype(int)

        new_df.to_csv(f"csv/{school}/{file.split('/')[1]}", index=False)


if __name__ == "__main__":
    main(sys.argv[1])