var client = new $.es.Client({
  hosts: 'localhost:9200'
});

$(function(){

  client.search({
    "body":{
      "aggs":{
        "types_count":{
          "terms": {"field": "state.keyword", "size":53}
        }
      }
    }
  })
  .then(function(body){
    console.log(body);
  })

})
