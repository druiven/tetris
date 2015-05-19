<?php
/**
 * Created by PhpStorm.
 * User: Gerard
 * Date: 8-4-2015
 * Time: 00:36
 */
/*$l=$_POST['level'];
$s=$_POST['score'];
$r=$_POST['rows'];*/

$s=$_GET['score'];
$l=$_GET['level'];
$r=$_GET['rows'];

if((is_numeric($l) || $l=='ongelofelijk') && is_numeric($s) && is_numeric($r)){
    $thescorefile=array();
    if(file_exists('scores.txt'))$thescorefile=file('scores.txt');
    if(count($thescorefile)<10000){
        $thescorefile[]=$s.','.$r.','.$l;
        //echo $thescorefile[0];
        rsort($thescorefile,SORT_NUMERIC);

        $scoreFile = fopen("scores.txt", "w");
        for($t=0;$t<count($thescorefile);$t++){
            $txt=trim($thescorefile[$t])."\n";
            fwrite($scoreFile,$txt);
        }

        fclose($scoreFile);
        echo $thescorefile[0];
    }

}

