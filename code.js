window.addEventListener("load", function(){
	
	const canvas = document.getElementById("canvas");
	const context = canvas.getContext("2d");
	const cvsw = canvas.width;
	const cvsh = canvas.height;
	const PI = Math.PI;
	const UP = 38;
	const DOWN = 40;
	let keystate = {};
	
	document.addEventListener("keydown", function(event){
		keystate[event.keyCode]=true;
	});	
	document.addEventListener("keyup", function(event){
		delete keystate[event.keyCode];
	});
	
	
	
	
	
	
});

