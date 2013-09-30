
	var BB = BB || {};
	BB.circle_timer = function(el, duration, size, options) {
		var opts = options || {};
		var _el = function(x){return document.getElementById(x);}

		var defaults = {
			update_rate:100, 
			back_color:'#933', 
			fore_color:'#eee', 
			on_change : function(){},
			on_complete : function(){return true},
			repeat : false
		}

		for (var prop in defaults) {
			this[prop] = opts[prop] || defaults[prop]
		}
		// PREP
		this.paused = true;
		this.canvas_size = size;
		this.time_elapsed = 0;
		this.start_angle = -Math.PI/2;
		this.duration = duration;	
		this.root = (typeof el == 'string') ? _el(el) : el; 
		this.ctxt = null;
		this.canvas = null;	
		this.elapsed = false;
	}
	BB.circle_timer.prototype = {
		draw_angle: function() {
			// point(s) to start the drawing, half the canvas size
			var drawX = drawY = radius = this.canvas_size / 2;
	
			// Calculate the end angle
			var end_angle = this.start_angle + this.angle_size;

			// draw angle
			this.ctxt.beginPath();              	  									
			this.ctxt.moveTo(drawX,drawY);            								
			this.ctxt.arc(drawX, drawY, radius, this.start_angle, end_angle, false); 	
			this.ctxt.closePath();            										
			this.ctxt.fillStyle = this.fore_color;    								
			this.ctxt.fill();                   										

			// calculate the new wedge size
			this.angle_size = (this.time_elapsed / this.duration) * Math.PI * 2;
			this.on_change({
				percent_complete:Math.round((this.time_elapsed / this.duration)*10000)/100, 
				remaining : this.duration-this.time_elapsed
			});

		
			// check to see whether we have filled the timer - remove time interval to stop overlap
			if (this.time_elapsed >= (this.duration)) {
				clearInterval(this.interval);
				result = this.on_complete();
				if (this.repeat && result){this.reset();}
			} else {
				// increment elapsed time
				this.time_elapsed = this.time_elapsed + this.update_rate;
			}
		
		},
		reset : function(delay){
			this.duration = delay || this.duration;
			this.root.innerHTML = '';
			this.canvas = null;
			if (this.interval) {
				clearInterval(this.interval);
			}
			this.init();
		},
		init : function(){
			var self = this;
			this.paused = false;
			this.angle_size = (this.update_rate / this.duration) * Math.PI * 2;
			if (!this.canvas) {
				var cnvs = document.createElement('canvas');
				cnvs.id = 'timer'
				cnvs.width = this.canvas_size;
				cnvs.height = this.canvas_size;
				cnvs.onclick = function(){self.toggle()}
				this.root.appendChild(cnvs);
				this.canvas = cnvs;
				this.ctxt = this.canvas.getContext("2d");
			}
		
			var drawX = drawY = radius = this.canvas_size / 2;
		
				this.ctxt.clearRect(0,0,this.canvas_size,this.canvas_size)
				this.ctxt.globalAlpha = 1;
				this.ctxt.beginPath();              	  
				this.ctxt.arc(drawX, drawY, radius, 0, Math.PI*2, true);
				this.ctxt.fillStyle = this.back_color; 
			    this.ctxt.fill();
			this.time_elapsed = 0;
			this.go();

		},
	
		go : function(){
			this.paused = false;
			var self = this;
			this.interval = setInterval(function(){self.draw_angle()}, this.update_rate)		
		},
		pause : function(){
			this.paused = true;
			clearInterval(this.interval)	
		},
		toggle : function(){
			(this.paused) ? this.go() : this.pause();
		},
		set_duration : function(d){
			this.duration = d;
		}
	}