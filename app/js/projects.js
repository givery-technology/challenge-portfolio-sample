$.get("/api/projects", function(data){
  console.log(data[0].title + "123456");

  var items = data.map(function (item) {
    return "<tr>" + "<td>" + item.id + "</td>" + "<td>" + item.url + "</td>" + "<td>" + item.title + "</td>" + "<td>" + item.description + "</td>" +  "</tr>";
  });

  var thead = "<thead><th>Id</th><th>url</th><th>Title</th><th>Description</th></tr></thead>";
  var tbody = "<tbody>" + items.join("") + "</tbody>";

  $( "<table/>", {
    "class": "table table-hover table-bordered table-responsive",
    html: thead+tbody
  }).appendTo( "#project-list" );

});
