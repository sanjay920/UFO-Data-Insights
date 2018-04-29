# Generating elastic search index

* Make sure you have elastic search installed on your system, On Mac, you can install it using the below command.

	`brew install elasticsearch`

* Next, from the root directory, run generate_json.py from the terminal

	`python generate_json.py`

   Running this should generate the elastic_index_data.json.

* This file is then indexed in elastic search by running the below curl command.

	`curl -s -H "Content-Type: application/x-ndjson" -XPOST localhost:9200/ufodata/ufo/_bulk --data-binary "@elastic_index_data.json";`

* Inorder to see if everthing is working fine. Run the following on the browser and look for errors.

	`http://localhost:9200/ufodata/_mapping/`

* If you run into CORS error, make the following changes to elasticsearch config file. Append these two lines to the end of the file(/usr/local/etc/elasticsearch/elasticsearch.yml).

	`http.cors.enabled: true`
	
	`http.cors.allow-origin: "*"`

# Steps to get Image Cat and Image space running on my local system.

* Follow the manual installation process for Image Cat and make sure the images are indexed in your local Solr Instance.

* Next, follow the manual installation process for Image Space given in the github read me.

	Notes
	
	* Flann Index(image_space/flann_index/) : Update the listing.txt with the path to your image urls.
		* Update IMAGE_SPACE_LISTS to point to the list.txt.
		* Install opencv and tangelo using pip.
		* Precompute the Flann index by running flann_index.py. The reason we are precomputing the pickle files, This process takes a long time to generate the files and when we query from image space, we won't get the results as there is a http timeout.
		* Once the pickle files are generated, set the following environment variables.
			* ``` IMAGE_SPACE_IMAGE_FILES = image_files.pickle ```
			* ``` IMAGE_SPACE_IMAGE_MAP = image_map.pickle ```
		* Next start the image similarity server by running ./start.sh
	
	* Girder : Make sure you have Girder v1.7 installed from source.
		* Create a virtual environment for girder and activate it.
		* Next , from girders root directory, pip install the requirements.txt and then
			* ``` girder-install web ```
			* ``` girder-install plugin -s <PATH-TO-IMAGE-SPACE>/imagespace ```
			* ``` girder-install plugin -s <PATH-TO-IMAGE-SPACE>/imagespace_flann ```
		* Next, we need to export a list of environment variables which girder will need
			* ``` export IMAGE_SPACE_SOLR=http://localhost:8081/solr/imagecatdev/ ```
			* ``` export IMAGE_SPACE_SOLR_PREFIX=/Users/sachingb/Development/USC/CSCI_599/Assignments/HW3/images_to_index/ ```
			* ``` export IMAGE_SPACE_PREFIX=http://localhost:57368/ ```
			* ``` export IMAGE_SPACE_FLANN_INDEX==http://localhost:9220/flann_index ```
		* Next start the girder server by running the below command
			* ``` python -m girder -p 8085 ```
	* Now, go to http://localhost:8085 and enable the imagespace and imagespace_flann plugins.
* Happy searching.


# Details for ufo.usc.edu website

* The code for the visualizations depicted on ufo.usc.edu website for our team can be found in HW3_website folder. 
