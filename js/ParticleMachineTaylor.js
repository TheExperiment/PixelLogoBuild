function ParticleMachine(data, target, canvasId) {

	this.dataSrc = data;
	this.ctx = $(canvasId)[0].getContext('2d');
	this.canvas = $(canvasId)[0];
	this.trg = $(target).eq(0);
	this.plot_points_start;
	this.plot_points_end;
	this.dims;
	this.midX;
	this.midY;
	this.winW;
	this.winH;
	this.tween;
	this.twObj = {
		val : 0
	};

	this.source_plot_data = $.getJSON(this.dataSrc, function() {
		//
	}).done(function(result) {
		console.log('json loaded');
	}).fail(function() {
		console.log("error");
	}).always(function() {
		//
	});

	this.init = function() {
		this.resetCanvas();
		this.dims = this.source_plot_data.responseJSON[1];
		this.plot_points_start = this.scatterDataPoints(
				this.source_plot_data.responseJSON[0], this.winW, this.winH);
		this.setNewEndPosition();
		shuffle(this.plot_points_end); // external utils lib
	}

	this.setPosition = function(pos) { // pos = 0-1
		if (pos == this.twObj.val) return;
		this.twObj.val = pos;
		this.tweenUpdate();
	}

	this.resetCanvas = function() {
		this.winW = this.trg.width();
		this.winH = this.trg.height();
		this.midX = this.winW / 2;
		this.midY = this.winH / 2;
		this.canvas.width = this.winW;
		this.canvas.height = this.winH;
	};

	this.setNewEndPosition = function() {
		var xPos = (this.winW/2) - (this.dims.width/2);
		var yPos = (this.winH/2) - (this.dims.height/2);
			
		this.plot_points_end = this.offsetDataPoints(
				this.source_plot_data.responseJSON[0], 
				xPos, yPos); // ending
	};

	this.tweenComplete = function() {

	};

	this.tweenUpdate = function() {
		var nextPlots = [];
		for (var i = 0; i < this.plot_points_end.length; i++) {
			var point1 = this.plot_points_start[i];
			var point2 = this.plot_points_end[i];
			var nextPoint = {};
			var p1X = point1['x'];
			var p1Y = point1['y'];
			var p2X = point2['x'];
			var p2Y = point2['y'];

			var p1R = point1['r'];
			var p2R = point2['r'];
			var p1G = point1['g'];
			var p2G = point2['g'];
			var p1B = point1['b'];
			var p2B = point2['b'];
			var p1A = point1['a'];
			var p2A = point2['a'];
			
			var perc = Math.min(this.twObj.val, 1);
			nextPoint['x'] = p1X + ((p2X - p1X) * perc);
			nextPoint['y'] = p1Y + ((p2Y - p1Y) * perc);
			nextPoint['r'] = p1R + ((p2R - p1R) * perc);
			nextPoint['g'] = p1G + ((p2G - p1G) * perc);
			nextPoint['b'] = p1B + ((p2B - p1B) * perc);
			nextPoint['a'] = p1A + ((p2A - p1A) * perc);
			
			nextPlots.push(nextPoint);
		}
		this.clear();
		this.draw(nextPlots);
	};

	this.scatterDataPoints = function(arr, w, h) {
		var cloned = $.extend(true, [], arr);
		for (var i = 0; i < cloned.length; i++) {
			var point = cloned[i];
			point['x'] = Math.ceil(Math.random() * w);
			point['y'] = Math.ceil(Math.random() * h);
		}
		return cloned;
	}

	this.offsetDataPoints = function(arr, x_offset, y_offset) {
		var cloned = $.extend(true, [], arr);
		for (var i = 0; i < cloned.length; i++) {
			var point = cloned[i];
			point['x'] = point['x'] + x_offset;
			point['y'] = point['y'] + y_offset;
		}
		return cloned;
	}

	this.draw = function(pointObj) {
		for (var i = 0; i < pointObj.length; i++) {
			var point = pointObj[i];
			var p = this.ctx.createImageData(1, 1);
			var px = point['x'];
			var py = point['y'];
			p.data[0] = point['r'] * 255;
			p.data[1] = point['g'] * 255;
			p.data[2] = point['b'] * 255;
			p.data[3] = point['a'] * 255;
			this.ctx.putImageData(p, px, py);
		}
	}

	this.clear = function() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
}
