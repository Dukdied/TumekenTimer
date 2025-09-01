export function _timer(callback) {
	var time = 0; 		// The default time of the timer
	var mode = 0; 		// Mode: count up or count down
	var status = 0; 	// Status: timer is running or stopped
	var timer_id; 		// This is used by setInterval function

	var start_time = new Date().getTime();
	// this will start the timer ex. start the timer with 1 second interval timer.start(1000) 
	this.start = function(interval) {
		interval = (typeof(interval) !== 'undefined') ? interval : 1000;

		if (status == 0) {
			status = 1;
			timer_id = setInterval(function() {
				time = start_time - (new Date().getTime());
				if (typeof(callback) === 'function') callback(time);
			}, interval);
		}
	}

	//  Same as the name, this will stop or pause the timer ex. timer.stop()
	this.stop = function() {
		if (status == 1) {
			status = 0;
			clearInterval(timer_id);
			callback(0);
		}
	}

	// Reset the timer to zero or reset it to your own custom time ex. reset to zero second timer.reset(0)
	this.reset = function(sec) {
		sec = (typeof(sec) !== 'undefined') ? sec : 0;
		start_time = (new Date().getTime()) + (sec * 100);
	}

	// Change the mode of the timer, count-up (1) or countdown (0)
	this.mode = function(tmode) {
		mode = tmode;
	}

	// This methode return the current value of the timer
	this.getTime = function() {
		return time;
	}

	// This methode return the current mode of the timer count-up (1) or countdown (0)
	this.getMode = function() {
		return mode;
	}

	// This methode return the status of the timer running (1) or stoped (1)
	this.getStatus = function() {
		return status;
	}
}