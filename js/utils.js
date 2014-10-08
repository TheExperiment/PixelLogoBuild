function shuffle(array, array2) {
	  var currentIndex = array.length, temporaryValue, randomIndex ;

	  // While there remain elements to shuffle...
	  while (0 !== currentIndex) {

	    // Pick a remaining element...
	    randomIndex = Math.floor(Math.random() * currentIndex);
	    currentIndex -= 1;

	    // And swap it with the current element.
	    temporaryValue = array[currentIndex];
	    if (array2) temporaryValue2 = array2[currentIndex];
	    array[currentIndex] = array[randomIndex];
	    if (array2) array2[currentIndex] = array2[randomIndex];
	    array[randomIndex] = temporaryValue;
	    if (array2) array2[randomIndex] = temporaryValue;
	  }

	  return array;
}