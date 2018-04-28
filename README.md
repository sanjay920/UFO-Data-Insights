# Generating elastic search index

1) Make sure you have elastic search installed on your system, On Mac, you can install it using the below command.

	brew install elasticsearch

2) Next, from the root directory, run generate_json.py from the terminal

	python generate_json.py

   Running this should generate the elastic_index_data.json.

3) This file is then indexed in elastic search by running the below curl command.

	curl -s -H "Content-Type: application/x-ndjson" -XPOST localhost:9200/ufodata/ufo/_bulk --data-binary "@elastic_index_data.json";

4) Inorder to see if everthing is working fine. Run the following on the browser and look for errors.

	http://localhost:9200/ufodata/_mapping/

5) If you run into CORS error, make the following changes to elasticsearch config file. Append these two lines to the end of the file(/usr/local/etc/elasticsearch/elasticsearch.yml).

	http.cors.enabled: true
	http.cors.allow-origin: "*"
