<?php

// usage :
// GET &inputFileName = someImage.png
// GET &outputFileName = 'data/someImage.json';

$inputFileName = '';
$outputFileName = '';

try
{
	$getVarInputFileName = $_GET["inputFileName"];
	$getVarOutputFileName = $_GET["outputFileName"];
}
catch (Exception $e)
{
	throw new Exception( 'Missing GET vars - need inputFileName and outputFileName', 0, $e);
}

$inputFileName = $getVarInputFileName;
$outputFileName = $getVarOutputFileName;

$image = new Imagick ( $inputFileName );
$d = $image->getImageGeometry ();
// print_r ( $d );
$width = $d ['width'];
$height = $d ['height'];

$pixels = [];
$positions = [];
for($w = 0; $w <= $width; $w ++) {
	for($h = 0; $h <= $height; $h ++) {
		$x = $w;
		$y = $h;
		$pixel = $image->getImagePixelColor ( $x, $y );
		$colors = $pixel->getColor (true);
		
		if ($colors ['a'] > 0) {
			$obj = ['x'=>$x, 'y'=>$y, 'r'=>$colors ['r'], 'g'=>$colors ['g'], 'b'=>$colors ['b'], 'a'=>$colors ['a']];
			
			array_push($positions, $obj);
		}
	}
}
array_push($pixels, $positions);
array_push($pixels, ['width'=>$width, 'height'=>$height]);


$json_output = fopen($outputFileName, "w") or die("Unable to open file!");
$txt = json_encode($pixels);
fwrite($json_output, $txt);
fclose($json_output);

echo 'Done. Timestamp: ' . date ("F d Y H:i:s.", filemtime($outputFileName));

?>