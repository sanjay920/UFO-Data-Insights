1) Install elastic search.

2) From the root directory of the project

3) Run the following command on the terminal

	curl -s -H "Content-Type: application/x-ndjson" -XPOST localhost:9200/ufodata/ufo/_bulk --data-binary "@elastic_index_data.json";

4) If you run into CORS error, make the following changes to elasticsearch config file. Append these two lines to the end of the file(/usr/local/etc/elasticsearch/elasticsearch.yml).

	http.cors.enabled: true
	http.cors.allow-origin: "*"

5) Inorder to see if everthing is working fine. Run the following on the browser and look for errors.
	
	http://localhost:9200/ufodata/_mapping/