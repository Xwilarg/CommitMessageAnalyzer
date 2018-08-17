function analyze(token) {
    result = "";
    brokenRules = {};
    document.getElementById("result").innerHTML = "Loading, please wait...";
    var http = new XMLHttpRequest();
    http.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            checkRules(this.responseText);
        }
    };
    http.open("GET", "php/getVerbs.php", true);
    http.send();
}

function increaseBrokenRule(brokenRules, name) {
    brokenRules[name] = (brokenRules[name] || 0) + 1;
}

var intro = "<table><tr><th>Author</th><th>Commit</th><th>Result</th></tr>";
var result = "";
var brokenRules = {};

function getCommit(author, repo, page, verbs) {
    var http = new XMLHttpRequest();
    http.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var json = JSON.parse(this.responseText);
            var needNext = (json.length < 100) ? false : true;
            json.forEach(function(elem) {
                var msg = elem.commit.message;
                var subject = msg.split('\n')[0];
                var name = elem.commit.author.name;
                result += "<tr><td>" + name + "</td><td>" + msg + "</td><td>"
                if (!subject.match("Merge branch[ 'a-zA-Z0-9_-]+ of https:\/\/github.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+")) {
                    if (!checkRule2(subject)) {
                        result += '<a href="https://chris.beams.io/posts/git-commit/#limit-50">Rule 2</a> ';
                        increaseBrokenRule(brokenRules, name);
                    }
                    if (!checkRule3(subject)) {
                        result += '<a href="https://chris.beams.io/posts/git-commit/#capitalize">Rule 3</a> ';
                        increaseBrokenRule(brokenRules, name);
                    }
                    if (!checkRule4(subject)) {
                        result += '<a href="https://chris.beams.io/posts/git-commit/#end">Rule 4</a> ';
                        increaseBrokenRule(brokenRules, name);
                    }
                    if (!checkRule5(subject, verbs)) {
                        result += '<a href="https://chris.beams.io/posts/git-commit/#imperative">Rule 5</a> ';
                        increaseBrokenRule(brokenRules, name);
                    }
                }
                result = result.replace(new RegExp('\n', 'g'), '<br/>');
                result += "</td></tr>";
            });
            var brokenResults = "";
            for (var key in brokenRules) {
                brokenResults += key + ": x" + brokenRules[key] + "<br/>";
            }
            document.getElementById("result").innerHTML = "<br/>" + brokenResults + "<br/>" + intro + result + "</table>";
            if (needNext) {
                getCommit(author, repo, page + 1, verbs);
            }
        }
    };
    http.open("GET", "php/request.php?author=" + author + "&repo=" + repo + "&page=" + page, true);
    http.send();
}

function checkRules(verbs) {
    document.getElementById("result").innerHTML = "Loading, please wait...";
    getCommit(document.getElementById("author").value, document.getElementById("repo").value, 1, verbs);
}

function checkRule1() { // Separate subject from body with a blank line
    return (true);
}

function checkRule2(subjectLine) { // Limit the subject line to 50 characters
    if (subjectLine.length > 50)
        return (false);
    return (true);
}

function checkRule3(subjectLine) { // Capitalize the subject line
    if (subjectLine[0] < 'A' || subjectLine[0] > 'Z')
        return (false);
    return (true);
}

function checkRule4(subjectLine) { // Do not end the subject line with a period
    var last = subjectLine.slice(-1);
    if (last == '.' || last == ',' || last == ';' || last == ':')
        return (false);
    return (true);
}

function checkRule5(subjectLine, verbs) { // Use the imperative mood in the subject line
    var allVerbs = verbs.split('\n');
    if (!allVerbs.includes(subjectLine.split(' ')[0].toLowerCase()))
        return (false);
    return (true);
}

function checkRule6() { // Wrap the body at 72 characters
    return (true);
}

function checkRule7() { // Use the body to explain what and why vs. how
    return (true);
}