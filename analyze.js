function analyze() {
    var http = new XMLHttpRequest();
    http.open("GET", "https://api.github.com/repos/" + document.getElementById("author").value + "/" + document.getElementById("repo").value + "/commits", false);
    http.send(null);
    if (http.status == 200)
    {
        var json = JSON.parse(http.responseText);
        document.getElementById("result").innerHTML = "Number of commits: " + json.length;
    }
    else
        document.getElementById("result").innerHTML = "This author/project doesn't exist.";
}