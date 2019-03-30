let getUrl = new URLSearchParams(window.location.search).get('url');
if (getUrl !== null)
    getCommit(getUrl);

function analyze() {
    getCommit(document.getElementById("url").value);
}

function drawCharts()
{
    let arrayError = new Array();
    let arrayRatio = new Array();
    arrayError.push(new Array());
    arrayError[0].push("Names");
    arrayError[0].push("Errors");
    arrayRatio.push(new Array());
    arrayRatio[0].push("Names");
    arrayRatio[0].push("Errors");
    let i = 1;
    for (let elem in allStats) {
        arrayError.push(new Array());
        arrayError[i].push(allStats[elem][0]);
        arrayError[i].push(allStats[elem][1]);
        arrayRatio.push(new Array());
        arrayRatio[i].push(allStats[elem][0]);
        arrayRatio[i].push(allStats[elem][2]);
        i++;
    }
    let data = google.visualization.arrayToDataTable(arrayError);
    let options = {
        backgroundColor: "#EEE",
        title: "Error per members (sum)"
    };
    let chart = new google.visualization.PieChart(document.getElementById("errorChart"));
    chart.draw(data, options);
    data = google.visualization.arrayToDataTable(arrayRatio);
    options = {
        backgroundColor: "#EEE",
        title: "Error per members (ratio error/commit)"
    };
    chart = new google.visualization.PieChart(document.getElementById("ratioChart"));
    chart.draw(data, options);
}

var intro = "<table><tr><th>Date time (UTC)</th><th>Author</th><th>Commit</th><th>Result</th></tr>";
var result = "";
var allStats;

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
                let jsonCommit = tmpJson[0];
                allStats = tmpJson[1];
                if (jsonCommit.length == 0) {
                    displayError("This repository doesn't exist.");
                    return;
                }
                jsonCommit.forEach(function(elem) {
                    let name = elem[0];
                    result += "<tr><td>" + elem[1] + "</td><td>" + '<a id="commitLink" href="' + elem[4] + '">' + name + '</td><td><a id="commitLink" href="' + elem[3] + '"><nav id="message">' + elem[2] + '</nav></a></td><td>';
                    if (!elem[5][0]) {
                        result += '<a target="_blank" href="https://chris.beams.io/posts/git-commit/#separate">Rule 1</a> ';
                    }
                    if (!elem[5][1]) {
                        result += '<a target="_blank" href="https://chris.beams.io/posts/git-commit/#limit-50">Rule 2</a> ';
                    }
                    if (!elem[5][2]) {
                        result += '<a target="_blank" href="https://chris.beams.io/posts/git-commit/#capitalize">Rule 3</a> ';
                    }
                    if (!elem[5][3]) {
                        result += '<a target="_blank" href="https://chris.beams.io/posts/git-commit/#end">Rule 4</a> ';
                    }
                    if (!elem[5][4]) {
                        result += '<a target="_blank" href="https://chris.beams.io/posts/git-commit/#imperative">Rule 5</a> ';
                    }
                    if (!elem[5][5]) {
                        result += '<a target="_blank" href="https://chris.beams.io/posts/git-commit/#wrap-72">Rule 6</a> ';
                    }
                    result = result.replace(new RegExp('\n', 'g'), '<br/>');
                    result += "</td></tr>";
                });
                resultElement.innerHTML = '<table><tr><td><div id="errorChart"></div></td><td><div id="ratioChart"></div></td></tr></table>'
                google.charts.load('current', {'packages':['corechart']});
                google.charts.setOnLoadCallback(drawCharts);
                if (!tmpJson[3])
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