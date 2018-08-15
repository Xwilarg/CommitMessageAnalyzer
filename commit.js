function analyze(token) {
    document.getElementById("result").innerHTML = "Loading, please wait...";
    var http = new XMLHttpRequest();
    http.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var result = "<table><tr><th>Commit</th><th>Result</th></tr>";
            var json = JSON.parse(this.responseText);
            json.forEach(function(elem) {
                var msg = elem.commit.message;
                var subject = msg.split('\n')[0]
                result += "<tr><td>" + msg + "</td><td>"
                if (!checkRule4(subject))
                    result += "Rule 4 ";
                result += "</td></tr>";
            });
            document.getElementById("result").innerHTML = result + "</table>";
        }
    };
    http.open("GET", "request.php?author=" + document.getElementById("author").value + "&repo=" + document.getElementById("repo").value, true);
    http.send();
}

function checkRule1() { // Separate subject from body with a blank line
    return (true);
}

function checkRule2() { // Limit the subject line to 50 characters
    return (true);
}

function checkRule3() { // Capitalize the subject line
    return (true);
}

function checkRule4(subjectLine) { // Do not end the subject line with a period
    var last = subjectLine.slice(-1);
    if (last == '.' || last == ',' || last == ';' || last == ':')
        return (false);
    return (true);
}

function checkRule5() { // Use the imperative mood in the subject line
    return (true);
}

function checkRule6() { // Wrap the body at 72 characters
    return (true);
}

function checkRule7() { // Use the body to explain what and why vs. how
    return (true);
}