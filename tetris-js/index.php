<?php
/**
 * Created by PhpStorm.
 * User: Gerard
 * Date: 4-4-2015
 * Time: 23:40
 */

?>
<!DOCTYPE html>
<html>
<head lang="en">
  <meta charset="UTF-8">
  <title>Tetris</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">


</head>
<body>
<section id="pageIllustration">
    <div id="tetris">
        <div id="menu">
            <p id="highscores">HIGHSCORE: <span id="highscore">00000</span> - <span id="highrows">0</span> - <span id="highlevel">0</span></p>
            <p id="start">
                <!--<a href="javascript:play();">START TETRIS MET SPATIEBALK.</a>-->
                <!--<img src="http://www.fundament.nl/wp-content/themes/fundament/tetris/images/uitleg.jpg" alt="" id="uitleg" />-->
                <img src="images/uitleg.jpg" alt="" id="uitleg" />

            </p>


            <p id="scorebord">score: <span id="score">00000</span><br>

                rijen: <span id="rows">0</span><br>
                level: <span id="level">0</span>

            </p>
            <p id="upcoming-holder">
                <canvas id="upcoming" height="75" width="75"></canvas>
            </p>
           

        </div>
        <div id="canvas-holder">
            <canvas id="canvas" width="300" height="400"></canvas>
        </div>
        <div id="soundonoff">
        </div>
    </div>
</section>
<link rel="stylesheet" href="css/tetris.css">
<script src="js/tetris.js"></script>
</body>
</html>