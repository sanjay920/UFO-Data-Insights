import pandas as pd
import json
import csv

# Read the csv generated in the previous assignmentt
df = pd.read_csv('datasets/UFO_sightings.csv', encoding='ISO-8859-1')

# Get rid of nan values, as it causes problems while indexing in Elastic Search
df = df.where((pd.notnull(df)), None)
# generate a json for each row in the csv. This creates a list of json values
json_data = df.to_dict(orient='records')

# Open a new file
with open('elastic_index_data.json', 'w') as f:
    # For each entry in the json list, create "new line" delimited values like below
    for val in json_data:
        f.write(json.dumps({"index":{}}))
        f.write("\n")
        f.write(json.dumps(val))
        f.write("\n")
    f.write("\n")

# This file is then fed into elastic using the bulk command
