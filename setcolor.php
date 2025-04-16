<?php
if (isset($_GET['color'])) {
    file_put_contents("current_color.txt", $_GET['color']);
}
