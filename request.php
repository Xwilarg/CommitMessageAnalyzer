<?php
    $token = file_get_contents('token.dat');
    $options = [
        "http" => [
            "method" => "GET",
            "header" => "User-Agent: Mozilla/5.0 commits.zirk.eu\r\n"
        ]
    ];
    $context = stream_context_create($options);
    echo(file_get_contents('https://api.github.com/repos/' . $_GET['author'] . '/' . $_GET['repo'] . '/commits?access_token=' . $token . '&per_page=100&page=' . $_GET['page'], false, $context));
?>