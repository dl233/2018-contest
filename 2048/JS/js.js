// JavaScript Document
var board=new Array();
var score=0;
var hasConflicted=new Array();
var maxscore=0;
var lock=true;

var startx=0;
var starty=0;
var endx=0;
var endy=0;


$(document).ready(function(){
	prepareForMobile();
	newgame();
	document.getElementById("newgamebutton").focus();
	document.getElementById("newgamebutton").blur();
});

function prepareForMobile(){
	if(documentWidth>500){
		gridContainerWidth=500;
		cellSpace=20;
		cellSideLength=100;
	}
	
	$('#grid-board').css('width',gridContainerWidth-2*cellSpace);
	$('#grid-board').css('height',gridContainerWidth-2*cellSpace);
	$('#grid-board').css('padding',cellSpace);
	$('#grid-board').css('border-radius',0.02*gridContainerWidth);
	
	$('.grid-cell').css('width',cellSideLength);
	$('.grid-cell').css('height',cellSideLength);
	$('.grid-cell').css('border-radius',0.02*cellSideLength);
	
}

function newgame(){
	init();//初始化
	randomGame();//随机生成格子X2
	randomGame();
}

function init(){
	for(var i=0;i<4;i++)
		for(var l=0;l<4;l++){
			
			var gridcell=$('#grid-cell-'+i+'-'+l);
			gridcell.css('top',getPosTop(i,l));
			gridcell.css('left',getPosLeft(i,l));
		}
	for(var i=0;i<4;i++){
		board[i]=new Array();
		hasConflicted[i]=new Array();
		for(var j=0;j<4;j++){
			board[i][j]=0;
			hasConflicted[i][j]=false;
		}
			
	}
	score=0;lock=true;
	UpdateScore(score,maxscore);
	$('#gameover').remove();
	updateBoardView();
}

function updateBoardView(){
	
	$(".number-cell").remove();
	for(var i=0;i<4;i++)
		for(var j=0;j<4;j++){
		$("#grid-board").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');
			var thenumbercell=$('#number-cell-'+i+'-'+j);
			
			if(board[i][j]==0){
				thenumbercell.css('width','0px');
				thenumbercell.css('height','0px');
				thenumbercell.css('top',getPosTop(i,j)+cellSpace/2);
				thenumbercell.css('left',getPosLeft(i,j)+cellSpace/2);
			}
			else{
				thenumbercell.css('width',cellSideLength);
				thenumbercell.css('height',cellSideLength);
				thenumbercell.css('top',getPosTop(i,j));
				thenumbercell.css('left',getPosLeft(i,j));
				thenumbercell.css('background-color',getNumberBGC(board[i][j]));
				thenumbercell.css('color',getNumberColor(board[i][j]));
				thenumbercell.text(board[i][j]);
			}
			hasConflicted[i][j]=false;
		}
	$('.number-cell').css('line-height',cellSideLength+"px");
	$('.number-cell').css('font-size',0.6*cellSideLength+"px");
	
}

function randomGame(){
	if(nospace(board))
		return false;
		
	var randx=parseInt(Math.floor(Math.random()*4));
	var randy=parseInt(Math.floor(Math.random()*4));
	
	var time=0;
	while(time<50){
		if(board[randx][randy]==0)
			break;
		
		randx=parseInt(Math.floor(Math.random()*4));
		randy=parseInt(Math.floor(Math.random()*4));
		time++;
	}
	if(time>=50){
		for(var i=0;i<4;i++)
		for(var j=0;j<4;j++){
			if(board[i][j]==0){
				randx=i;
				randy=j;
			}
		}
	}
	
	var randNumber=Math.random();
	if(randNumber>0.5)
		randNumber=2;
	else
		randNumber=4;
	
	board[randx][randy]=randNumber;
	showNumberWA(randx,randy,randNumber);

	return true;
}

$(document).keydown(function(event){
//	event.preventDefault();
	switch(event.keyCode){
		case 37://左
			event.preventDefault();
			if(moveLeft()){
				setTimeout("randomGame()",210);
				setTimeout("isgameover()",300);
			}
			break;
		case 38://上
			event.preventDefault();
			if(moveUp()){
				setTimeout("randomGame()",210);
				setTimeout("isgameover()",300);
			}
			break;
		case 39://右
			event.preventDefault();
			if(moveRight()){
				setTimeout("randomGame()",210);
				setTimeout("isgameover()",300);
			}
			break;
		case 40://下
			event.preventDefault();
			if(moveDown()){
				setTimeout("randomGame()",210);
				setTimeout("isgameover()",300);
			}
			break;
		default:
			break;
	}
});

document.addEventListener('touchstart',function(event){
	startx=event.touches[0].pageX;
	starty=event.touches[0].pageY;
	

})

document.addEventListener('touchmove',function(event){
	event.preventDefault();
});

document.addEventListener('touchend',function(event){
	endx=event.changedTouches[0].pageX;
	endy=event.changedTouches[0].pageY;
	
	var deltax=endx-startx;
	var daltay=endy-starty;
	
	if(Math.abs(deltax)<documentWidth*0.05&&dMath.abs(deltay)<documentWidth*0.002)
	  return;
		
	if(Math.abs(deltax)>Math.abs(daltay)){
		
		if(endx>startx){//右
			if(moveRight()){
				setTimeout("randomGame()",210);
				setTimeout("isgameover()",300);
			}
		}else{//左
			if(moveLeft()){
				setTimeout("randomGame()",210);
				setTimeout("isgameover()",300);
			}
		}
		
	}else{
		if(endy>starty){//下
			if(moveDown()){
				setTimeout("randomGame()",210);
				setTimeout("isgameover()",300);
			}
		}else{//上
			if(moveUp()){
				setTimeout("randomGame()",210);
				setTimeout("isgameover()",300);
			}
			
		}
		
		
	}
})

function isgameover(){
	if(nospace(board)&&nomove(board)){
		gameover();
	}
}
function gameover(){
	$('#grid-board').append('<div id="gameover"><p id="gameover-text">Game   Over</p><a class="gameovera" onClick="newgame()">Try Again</a></div>');
	lock=false;
}

function Continue(){
	lock=true;
	$('#gameover').remove();
}

function moveLeft(){
	
	if(!canMoveLeft(board)||!lock)
		return false;
	
	for(var i=0;i<4;i++)
		for(var j=1;j<4;j++){
			if(board[i][j]!=0){
				
				for(var k=0;k<j;k++){
					if(board[i][k]==0&&noBlockHorizontalLeft(i,k,j,board)){
						showMoveAnimation(i,j,i,k);
						board[i][k]=board[i][j];
						board[i][j]=0; 
						continue;
					}
					else if(board[i][k]==board[i][j]&&noBlockHorizontalLeft(i,k,j,board)&&!hasConflicted[i][k]){
						showMoveAnimation(i,j,i,k);
						board[i][k]+=board[i][j];
						board[i][j]=0; 
						score+=board[i][k];
						if(score>maxscore)
							maxscore=score;
						UpdateScore(score,maxscore);
						
						hasConflicted[i][k]=true;
						continue;
					}
				}
			}
		}
		setTimeout("updateBoardView()",200);
 return true;
}

function moveUp(){
	if(!canMoveUp(board)||!lock)
	return false;
	
	for(var j=0;j<4;j++)
		for(var i=1;i<4;i++){
			if(board[i][j]!=0){
				
			for(var k=0;k<i;k++){
					if(board[k][j]==0&&noBlockHorizontalUp(j,k,i,board)){
						showMoveAnimation(i,j,k,j);
						board[k][j]=board[i][j];
						board[i][j]=0;
						continue;
					}
					else if(board[k][j]==board[i][j]&&noBlockHorizontalUp(j,k,i,board)&&!hasConflicted[k][j]){
						showMoveAnimation(i,j,k,j);
						board[k][j]+=board[i][j];
						board[i][j]=0;
						score+=board[k][j];
						if(score>maxscore)
							maxscore=score;
						UpdateScore(score,maxscore);
						hasConflicted[k][j]=true;
						continue;
					}
				}
			}
		}
		setTimeout("updateBoardView()",200);
 return true;
}

function moveDown(){
	if(!canMoveDown(board)||!lock)
	return false;
	
	for(var j=0;j<4;j++)
		for(var i=2;i>=0;i--){
			if(board[i][j]!=0){
				
				for(var k=3;k>i;k--){
					
					if(board[k][j]==0&&noBlockHorizontalDown(j,k,i,board)){
						showMoveAnimation(i,j,k,j);
						board[k][j]=board[i][j];
						board[i][j]=0;
						continue;
					}
					else if(board[k][j]==board[i][j]&&noBlockHorizontalDown(j,k,i,board)&&!hasConflicted[k][j]){
						showMoveAnimation(i,j,k,j);
						board[k][j]+=board[i][j];
						board[i][j]=0;
						score+=board[k][j];
						if(score>maxscore)
							maxscore=score;
						UpdateScore(score,maxscore);
						hasConflicted[k][j]=true;
						continue;
					}
				}
			}
		}
		setTimeout("updateBoardView()",200);
 return true;
}

function moveRight(){
	
		if(!canMoveRight(board)||!lock)
		return false;
	    
	   for(var i=0;i<4;i++)
		for(var j=2;j>=0;j--){
			if(board[i][j]!=0){
				
				for(var k=3;k>j;k--){
					
					if(board[i][k]==0&&noBlockHorizontalRight(i,k,j,board)){
						showMoveAnimation(i,j,i,k);
						board[i][k]=board[i][j];
						board[i][j]=0; 
						continue;
					}
					else if(board[i][k]==board[i][j]&&noBlockHorizontalRight(i,k,j,board)&&!hasConflicted[i][k]){
						showMoveAnimation(i,j,i,k);
						board[i][k]+=board[i][j];
						board[i][j]=0; 
						score+=board[i][k];
						if(score>maxscore)
							maxscore=score;
						UpdateScore(score,maxscore);
						hasConflicted[i][k]=true;
						continue;
					}
				}
			}
		}
		setTimeout("updateBoardView()",200);
 return true;
}