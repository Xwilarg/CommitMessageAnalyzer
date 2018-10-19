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
    do
    {
        $commits = json_decode(file_get_contents('https://api.github.com/repos/' . $_GET['author'] . '/' . $_GET['repo'] . '/commits?access_token=' . $token . '&per_page=100&page=' . $page, false, $context));

        $array = array();
        $rules = array('checkRule1', 'checkRule2', 'checkRule3', 'checkRule4', 'checkRule5', 'checkRule6', 'checkRule7');
        foreach ($commits as $i) {
            $elem = json_decode(json_encode($i), true);
            $rule = array();
            $commitMsg = $elem['commit']['message'];
            $subjectLine = explode(PHP_EOL, $commitMsg)[0];
            if (!preg_match("/Merge branch[ 'a-zA-Z0-9_-]+ of https:\/\/github.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+/", $subjectLine)) {
                foreach ($rules as $r) {
                    array_push($rule, call_user_func($r, $subjectLine, $verbs));
                }
            }
            else
                array_push($rule, true, true, true, true, true, true, true);
            array_push($array, array($elem['commit']['author']['name'], $commitMsg, $rule));
        }
        $page += 1;
    } while (count($commits) == 100);

    echo(json_encode($array));

    function checkRule1() { // Separate subject from body with a blank line
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

    function checkRule6() { // Wrap the body at 72 characters
        return (true);
    }
    
    function checkRule7() { // Use the body to explain what and why vs. how
        return (true);
    }
?>