var board=new Array();
var score=0;
var hasConflicted=new Array();


$(document).ready(function(){
	newgame();
	$('#grid-board').click(function(){
		if(document.body.style.overflow!="hidden")
			document.body.style.overflow="hidden"; 
		else
			document.body.style.overflow="auto";
	});
});

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
				thenumbercell.css('top',getPosTop(i,j)+50);
				thenumbercell.css('left',getPosLeft(i,j)+50);
			}
			else{
				thenumbercell.css('width','100px');
				thenumbercell.css('height','100px');
				thenumbercell.css('top',getPosTop(i,j));
				thenumbercell.css('left',getPosLeft(i,j));
				thenumbercell.css('background-color',getNumberBGC(board[i][j]));
				thenumbercell.css('color',getNumberColor(board[i][j]));
				thenumbercell.text(board[i][j]);
			}
			hasConflicted[i][j]=false;
		}
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
	switch(event.keyCode){
		case 37://左
			if(moveLeft()){
				setTimeout("randomGame()",210);
				setTimeout("isgameover()",300);
			}
			break;
		case 38://上
			if(moveUp()){
				setTimeout("randomGame()",210);
				setTimeout("isgameover()",300);
			}
			break;
		case 39://右
			if(moveRight()){
				setTimeout("randomGame()",210);
				setTimeout("isgameover()",300);
			}
			break;
		case 40://下
			if(moveDown()){
				setTimeout("randomGame()",210);
				setTimeout("isgameover()",300);
			}
			break;
		default:
			break;
	}
});

function isgameover(){
	if(nospace(board)&&nomove(board)){
		gameover();
	}
}
function gameover(){
	alert("Game Over!");
}

function moveLeft(){
	
	if(!canMoveLeft(board))
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
						UpdateScore(score);
						
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
	if(!canMoveUp(board))
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
						score+=board[i][k];
						UpdateScore(score);
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
	if(!canMoveDown(board))
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
						score+=board[i][k];
						UpdateScore(score);
						
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
	
		if(!canMoveRight(board))
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
						UpdateScore(score);
						hasConflicted[i][k]=true;
						continue;
					}
				}
			}
		}
		setTimeout("updateBoardView()",200);
 return true;
}