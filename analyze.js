function analyze() {
    document.getElementById("result").innerHTML = "Loading, please wait...";
    var http = new XMLHttpRequest();
    var index = 1;
    var result = "<table><tr><th>Commit</th><th>Result</th></tr>";
    while (true)
    {
        http.open("GET", "https://api.github.com/repos/" + document.getElementById("author").value + "/" + document.getElementById("repo").value + "/commits?page=" + index, false);
        http.send(null);
        if (http.status == 200)
        {
            var json = JSON.parse(http.responseText);
            json.forEach(function(elem) {
                var msg = elem.commit.message;
                var subject = msg.split('\n')[0]
                result += "<tr><td>" + msg + "</td><td>"
                if (!checkRule4(subject))
                    result += "Rule 4 ";
                result += "</td></tr>";
            });
        }
        else
            break;
        index++;
    };
    if (index == 1)
        document.getElementById("result").innerHTML = "This author/project doesn't exist.";
    else
        document.getElementById("result").innerHTML = result + "</table>";
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