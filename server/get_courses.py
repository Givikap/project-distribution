import glob
import json
import pandas as pd
import sys


#
# Prints all unique courses for a given as an argument school
#
def main(school):
    courses = pd.Series()

    for file in glob.glob(f"csv/{school}/*"):
        df = pd.read_csv(file)

        with open("text.txt", 'w') as file:
            file.write(df["CRS SUBJ CD"].to_string() + courses.to_string())

        courses = pd.concat([courses, df["CRS SUBJ CD"].dropna()])
        courses.drop_duplicates(inplace=True)

    print(json.dumps(sorted(courses)))


if __name__ == "__main__":
    main(sys.argv[1])