<?php
    $token = file_get_contents('token.dat');
    var_dump(file_get_contents('https://api.github.com/repos/' . $_GET['author'] . '/' . $_GET['repo'] . '/commits?access_token=' . $token . '&per_page=100'));
?>