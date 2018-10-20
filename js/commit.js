function analyze() {
    result = "";
    brokenRules = {};
    document.getElementById("result").innerHTML = "Loading, please wait...";
    let e = document.getElementById("website");
    getCommit(document.getElementById("author").value, document.getElementById("repo").value, e.options[e.selectedIndex].value);
}

function increaseBrokenRule(brokenRules, name) {
    brokenRules[name] = (brokenRules[name] || 0) + 1;
}

function addName(mail, name) {
    if (!(mail in mailToName))
        mailToName[mail] = { [name]: 1};
    else
        mailToName[mail][name] = (mailToName[mail][name] || 0) + 1;
}

var intro = "<table><tr><th>Author</th><th>Commit</th><th>Result</th></tr>";
var result = "";
var brokenRules = {};
var mailToName = [];

function getCommit(author, repo, website) {
    var http = new XMLHttpRequest();
    http.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var json = JSON.parse(this.responseText);
            json.forEach(function(elem) {
                addName(elem[2], elem[0]);
            });
            mailToName.forEach(function(elem) {
                elem.sort(function(a, b) {
                    if (a > b) return 1;
                    else return -1;
                })
            });
            json.forEach(function(elem) {
                var name = Object.keys(mailToName[elem[2]])[0];
                result += "<tr><td>" + name + "</td><td>" + elem[1] + "</td><td>";
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
                result = result.replace(new RegExp('\n', 'g'), '<br/>');
                result += "</td></tr>";
            });
            var brokenResults = "";
            for (var key in brokenRules) {
                brokenResults += key + ": x" + brokenRules[key] + "<br/>";
            }
            document.getElementById("result").innerHTML = "<br/>" + brokenResults + "<br/>" + intro + result + "</table>";
        }
    };
    http.open("GET", "php/request.php?author=" + author + "&repo=" + repo + "&website=" + website, true);
    http.send();
}