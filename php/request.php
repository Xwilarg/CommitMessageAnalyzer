<?php
    $token = file_get_contents('token.dat');
    $options = [
        "http" => [
            "method" => "GET",
            "header" => "User-Agent: Mozilla/5.0 commits.zirk.eu\r\n"
        ]
    ];
    $context = stream_context_create($options);

    $verbs = explode(PHP_EOL, file_get_contents("verbs.txt"));

    $page = 1;
    $isGithub = $_GET['website'] === "github";
    $array = array();
    $rules = array('checkRule1', 'checkRule2', 'checkRule3', 'checkRule4', 'checkRule5', 'checkRule6', 'checkRule7');
    do
    {
        if ($isGithub)
            $url = 'https://api.github.com/repos/' . $_GET['author'] . '/' . $_GET['repo'] . '/commits?access_token=' . $token . '&';
        else
            $url = 'https://gitlab.com/api/v4/projects/' . urlencode($_GET['author'] . '/' . $_GET['repo']) . '/repository/commits?';
        $url .= "per_page=100&page=" . $page;
        $commits = json_decode(file_get_contents($url, false, $context));
        foreach ($commits as $i) {
            $elem = json_decode(json_encode($i), true);
            $rule = array();
            if ($isGithub)
            {
                $commitMsg = $elem['commit']['message'];
                $commitName = $elem['commit']['author']['name'];
                $commitEmail = $elem['commit']['author']['email'];
                $commitUrl = $elem['html_url'];
            }
            else
            {
                $commitMsg = $elem['title'];
                $commitName = $elem['author_name'];
                $commitEmail = $elem['author_email'];
                $commitUrl = "https://gitlab.com/" . $_GET['author'] . '/' . $_GET['repo'] . "/commit/" . $elem['id'];
            }
            $lines = explode(PHP_EOL, $commitMsg);
            $subjectLine = $lines[0];
            $otherLines = array_slice($lines, 1);
            if (!preg_match("/Merge branch[ 'a-zA-Z0-9_-]+ of https:\/\/github.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+/", $subjectLine)
            && !preg_match("/Merge [ 'a-zA-Z0-9_-]+ #[0-9]+ from [ 'a-zA-Z0-9_-]+\/[ 'a-zA-Z0-9_-]+/", $subjectLine)) {
                foreach ($rules as $r) {
                    array_push($rule, call_user_func($r, $subjectLine, $verbs, $otherLines));
                }
            }
            else
                array_push($rule, true, true, true, true, true, true, true);
            array_push($array, array($commitName, $commitMsg, $commitEmail, $commitUrl, $rule));
        }
        $page += 1;
    } while (count($commits) == 100 && $page <= 5);

    echo(json_encode([$array, $page <= 5]));

    function checkRule1($subjectLine, $verbs, $otherLines) { // Separate subject from body with a blank line
        if (strlen($otherLines) === 0)
            return (true);
        if (strlen($otherLines) < 2 || $otherLines[0] !== "" || $otherLines[1] === "")
            return (false);
        return (true);
    }

    function checkRule2($subjectLine) { // Limit the subject line to 50 characters
        if (strlen($subjectLine) > 50)
            return (false);
        return (true);
    }

    function checkRule3($subjectLine) { // Capitalize the subject line
        if ($subjectLine[0] < 'A' || $subjectLine > 'Z')
            return (false);
        return (true);
    }

    function checkRule4($subjectLine) { // Do not end the subject line with a period
        $last = substr($subjectLine, -1);
        if ($last == '.' || $last == ',' || $last == ';' || $last == ':')
            return (false);
        return (true);
    }

    function checkRule5($subjectLine, $verbs) { // Use the imperative mood in the subject line
        if (in_array(strtolower(explode(' ', $subjectLine)[0]), $verbs))
            return (true);
        return (false);
    }

    function checkRule6($subjectLine, $verbs, $otherLines) { // Wrap the body at 72 characters
        foreach ($otherLines as $line)
            if (strlen($line) > 72)
                return (false);
        return (true);
    }
    
    function checkRule7() { // Use the body to explain what and why vs. how
        return (true);
    }
?>