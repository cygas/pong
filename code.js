window.addEventListener("load", function(){
	
	const canvas = document.getElementById("canvas");
	const ctx = canvas.getContext("2d");
	const cvsw = canvas.width;
	const cvsh = canvas.height;
	const PI = Math.PI;
	const UP = 38;
	const DOWN = 40;
	let keystate = {};
	let number = null;	
	let s = Math.random()>0.5?1:-1;
	
	//zobacz, jak będzie bez tego
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
		score: 0,
		update: function(){
			if(keystate[UP]){
				this.y-=7;
			}
			if(keystate[DOWN]){
				this.y+=7;
			}
			this.y = Math.max(Math.min(this.y, cvsh-this.height),0);
			
		},
		draw: function(){
			ctx.fillRect(this.x, this.y, this.width, this.height);
		}		
	};
	
	let ai= {		
		x: null,
		y: null,
		width: 20,
		height: 100,
		score: 0,
		update: function(){
			let desty = ball.y - (this.height - ball.side)*0.5;
			this.y += (desty-this.y)*0.1;
			this.y  = Math.max(Math.min(this.y, cvsh - this.height),0);
			
		},
		draw: function(){			
			ctx.fillRect(this.x,this.y,this.width, this.height);
		}
	};
	
	let ball = {
		x: null,
		y: null,
		vel: {
			x: 0,
			y: 0
		},
		side: 20,
		speed: 12,			
		reset: function(){
			this.x = cvsw/2 - this.side/2;
			this.y = cvsh/2 - this.side/2;
			
			this.vel.x = 0;
			this.vel.y = 0;			
		},
		start: function(side){
			let r = Math.random();
			let phi = 0.1*PI*(1-2*r);
			
			if(this.vel.x === 0 && this.vel.y ===0){
				this.vel.x = side*this.speed*Math.cos(phi);
				this.vel.y = this.speed*Math.sin(phi);
			}
		},
		update: function(){
			this.x += this.vel.x;
			this.y +=this.vel.y;
			
			if(0>this.y || this.y+this.side > cvsh){
				let offset = this.vel.y < 0? 0-this.y:cvsh-(this.y + this.side);
				this.y += 2*offset; //to można wyłączyć. ale wtedy może robić się bug na końcach 
				this.vel.y *= -1;
			}
			
			let AABB = function(ax, ay, aw, ah, bx, by, bw, bh){
				return ax< bx+bw && ay<by+bh && bx < ax+aw && by < ay+ah;
			}
			
			let padle = this.vel.x < 0 ? player : ai;
			//czy piłka jest w obrębie paletki
			if(AABB(padle.x, padle.y, padle.width, padle.height, this.x, this.y, this.side, this.side)){
				this.x = padle===player? player.x +player.width: ai.x - this.side;
				// 0<=n<=1
				let n = (this.y + this.side - padle.y)/(padle.height+this.side);
				let phi = 0.25*PI*(2*n-1); //pi/4 = 45; PI/4<=phi<=PI/4
				
				let smash = Math.abs(phi)>0.2*PI ? 1.5:1;
				this.vel.x = smash*(padle===player?1:-1)*this.speed*Math.cos(phi);
				this.vel.y = smash*this.speed*Math.sin(phi);
			}
			
			if(this.x+this.side<0 || this.x> cvsw){		
				let num = (padle===player?1:-1);
				number = (padle===player?1:-1);
				num===1?ai.score++:player.score++;
				this.reset();										
			}
		},
		
		draw: function(){			
			ctx.fillRect(this.x,this.y,this.side, this.side);
		}		
	};
	
	
	function init(num){
		player.x = player.width;
		player.y = (cvsh - player.height)/2;
		
		ai.x = cvsw - 2*ai.width;
		ai.y = (cvsh - ai.height)/2;

		ball.reset();		
	}
	
	function draw(){
		ctx.fillRect(0,0, cvsw, cvsh);
		ctx.save();
		ctx.fillStyle = "#fff";
		ball.draw();
		player.draw();
		ai.draw();
		
		const w = 4;
		const x = (cvsw-w)/2;
		const step = cvsh/20;
		let y = 0;
		while(y<cvsh){
			ctx.fillRect(x, y+step/4, w, step/2);
			y+=step;
		}
		
		function drawScore(){
			const CHAR_PIXEL = 10;
			const CHARS = [
				"111101101101111", 
				"010010010010010",
				"111001111100111",
				"111001111001111",
				"100101111001001",
				"111100111001111",
				"111100111101111",
				"111001001001001",
				"111101111101111",
				"111101111001111"
				].map(str => {
					const canvas = document.createElement("canvas");
					canvas.height = CHAR_PIXEL*5;
					canvas.width = CHAR_PIXEL*3;
					const context = canvas.getContext("2d");
					context.fillStyle = "#fff";
					str.split('').forEach((fill, i)=> {
						if(fill === '1'){
							context.fillRect((i % 3) * CHAR_PIXEL, (i/3|0)*CHAR_PIXEL,CHAR_PIXEL,CHAR_PIXEL);
						}
					});
					return canvas;
				});		
		
		
			const align = cvsw/3;
			const CHAR_W = CHAR_PIXEL*4;
			const chars = player.score.toString().split('');
			const charsai = ai.score.toString().split('');
			const offset = align -(CHAR_W*chars.length/2) + CHAR_PIXEL/2;
			const offsetai = align*2 -(CHAR_W*charsai.length/2) + CHAR_PIXEL/2;
			chars.forEach((char, pos)=>{
					ctx.drawImage(CHARS[char|0],offset + pos*CHAR_W, 20);
				});
			charsai.forEach((char, pos)=>{
					ctx.drawImage(CHARS[char|0],offsetai + pos*CHAR_W, 20);
				});
				
		}
		drawScore();
		
		ctx.restore();
	}
	
	function update(){
		ball.update();
		player.update();
		ai.update();
		draw();
		requestAnimationFrame(update);
	}
	
	init();	
	update();	
	document.addEventListener("keydown", function(event){
			if(event.keyCode === 32){
				if(player.score===0 && ai.score===0){
					ball.start(s);
				}else{
					ball.start(number);
				}					
			}
	});
	
	
});

