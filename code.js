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
	/*
	console.log(keystate);	
	setTimeout(function(){console.log(keystate);}, 3000);
	*/
	
	let player = {
		x: null,
		y: null,
		width: 20,
		height: 100,
		update: function(){
			if(keystate.UP){
				this.y+=7;
			}
			if(keystate.DOWN){
				this.y-=7;
			}
			this.y = Math.max(Math.min(this.y, cvsh-this.height),0);
		},
		draw: function(){
			context.fillRect(this.x, this.y, this.width, this.height);
		}
		
	};
	
	
	
	
	
});

