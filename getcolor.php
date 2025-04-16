<?php
header("Content-Type: text/event-stream");
header("Cache-Control: no-cache");

$lastColor = "";

while (true) {
    $color = @file_get_contents("current_color.txt");

    if ($color !== false && $color !== $lastColor) {
        echo "data: $color\n\n";
        ob_flush();
        flush();
        $lastColor = $color;
    }

    sleep(1);
}
