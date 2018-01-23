window.addEventListener("load", function(){
	
	const canvas = document.getElementById("canvas");
	const context = canvas.getContext("2d");
	const cvsw = canvas.width;
	const cvsh = canvas.height;
	const PI = Math.PI;
	const UP = 38;
	const DOWN = 40;
	let keystate = {};
	
	
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
		update: function(){
			if(keystate[UP]){
				this.y+=7;
			}
			if(keystate[DOWN]){
				this.y-=7;
			}
			this.y = Math.max(Math.min(this.y, cvsh-this.height),0);
		},
		draw: function(){
			context.fillRect(this.x, this.y, this.width, this.height);
		}
		
	};
	
	let ai= {		
		x: null,
		y: null,
		width: 20,
		height: 100,		
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
		vel: null,
		side: 20,
		speed: 12,	
		serve: function(side){
			let r = Math.random();
			this.x = side === 1? player.x+player.width : ai.x - this.side;
			this.y = (cvsh-this.side)*r;
			
			let phi = 0.1*PI*(1-2*r);
			this.vel = {
				x: side*this.speed*Math.cos(phi),
				y: this.speed*Math.sin(phi)
			}
		},		
		update: function(){
			this.x += this.vel.x;
			this.y +=this.vel.y;
			
			if(0>this.y || this.y+this.side > cvsh){
				let offset = this.vel.y < 0? 0-this.y:cvsh-(this.y + this.side);
				//this.y += 2*offset;
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
			
			if(0>this.x+this.side || this.x > cvsw){				
					this.serve(padle===player?1:-1);					
				}
			},
		
		draw: function(){			
			ctx.fillRect(this.x,this.y,this.side, this.side);
		}		
	};
	
	
	let test;
	
	
	
	
	
	
});

