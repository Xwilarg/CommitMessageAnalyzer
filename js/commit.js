let getUrl = new URLSearchParams(window.location.search).get('url');
if (getUrl !== null)
    getCommit(getUrl);

function analyze() {
    getCommit(document.getElementById("url").value);
}

function increaseBrokenRule(brokenRules, name) {
    brokenRules[name] = (brokenRules[name] || 0) + 1;
}

function drawChart()
{
    let array = new Array();
    array.push(new Array());
    array[0].push("Names");
    array[0].push("Errors");
    let i = 1;
    for (var key in brokenRules) {
        array.push(new Array());
        array[i].push(key);
        array[i].push(brokenRules[key]);
        i++;
    }
    let data = google.visualization.arrayToDataTable(array);
    let options = {
        title: "Error per members"
    };
    let chart = new google.visualization.PieChart(document.getElementById("errorChart"));
    chart.draw(data, options);
}

var intro = "<table><tr><th>Author</th><th>Commit</th><th>Result</th></tr>";
var result = "";
var brokenRules = {};
var mailToName = [];

function displayError(message) {
    let htmlElement = document.getElementsByClassName("result")[0];
    htmlElement.className += " error";
    htmlElement.innerHTML = message;
}


function getCommit(url) {
    result = "";
    brokenRules = {};
    let resultElement = document.getElementsByClassName("result")[0];
    resultElement.className = "result";
    resultElement.innerHTML = "Loading, please wait...";
    let http = new XMLHttpRequest();
    http.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {
                let tmpJson = JSON.parse(this.responseText);
                let json = tmpJson[0];
                if (json.length == 0) {
                    displayError("This repository doesn't exist.");
                    return;
                }
                json.forEach(function(elem) {
                    let name = elem[0];
                    result += "<tr><td>" + name + '</td><td><a id="commitLink" href="' + elem[2] + '">' + elem[1] + '</a></td><td>';
                    if (!elem[3][0]) {
                        result += '<a target="_blank" href="https://chris.beams.io/posts/git-commit/#separate">Rule 1</a> ';
                        increaseBrokenRule(brokenRules, name);
                    }
                    if (!elem[3][1]) {
                        result += '<a target="_blank" href="https://chris.beams.io/posts/git-commit/#limit-50">Rule 2</a> ';
                        increaseBrokenRule(brokenRules, name);
                    }
                    if (!elem[3][2]) {
                        result += '<a target="_blank" href="https://chris.beams.io/posts/git-commit/#capitalize">Rule 3</a> ';
                        increaseBrokenRule(brokenRules, name);
                    }
                    if (!elem[3][3]) {
                        result += '<a target="_blank" href="https://chris.beams.io/posts/git-commit/#end">Rule 4</a> ';
                        increaseBrokenRule(brokenRules, name);
                    }
                    if (!elem[3][4]) {
                        result += '<a target="_blank" href="https://chris.beams.io/posts/git-commit/#imperative">Rule 5</a> ';
                        increaseBrokenRule(brokenRules, name);
                    }
                    if (!elem[3][5]) {
                        result += '<a target="_blank" href="https://chris.beams.io/posts/git-commit/#wrap-72">Rule 6</a> ';
                        increaseBrokenRule(brokenRules, name);
                    }
                    result = result.replace(new RegExp('\n', 'g'), '<br/>');
                    result += "</td></tr>";
                });
                resultElement.innerHTML = '<div id="errorChart"></div>'
                google.charts.load('current', {'packages':['corechart']});
                google.charts.setOnLoadCallback(drawChart);
                if (!tmpJson[1])
                    result += "<strong>Warning: Only the 500 firsts commits were analysed.</strong>";
                resultElement.innerHTML += "<br/>" + intro + result + "</table>";
            }
            else {
                displayError("The server returned a " + this.status + " error code.");
            }
        }
    };
    http.open("GET", "php/request.php?url=" + url, true);
    http.send();
}