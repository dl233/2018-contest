function showNumberWA(i,j,randNumber){
	
	var numbercell=$('#number-cell-'+i+'-'+j);
	numbercell.css('background-color',getNumberBGC(randNumber));
	numbercell.css('color',getNumberColor(randNumber));
	numbercell.text(randNumber);
	
	numbercell.animate({
		width:"100px",
		height:"100px",
		top:getPosTop(i,j),
		left:getPosLeft(i,j)
	},100);
}

function showMoveAnimation(fromx,fromy,tox,toy){
	
	var numbercell=$('#number-cell-'+fromx+'-'+fromy);
	numbercell.animate({
		top:getPosTop(tox,toy),
		left:getPosLeft(tox,toy)
	},200);
}

function UpdateScore(score,maxscore){
	$('#score').text(score);
	$('#maxscore').text(maxscore);
}
