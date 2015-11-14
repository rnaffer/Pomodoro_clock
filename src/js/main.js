;(function(window) {

	'use strict'

	var Pomodoro = {
		// Clock properties
		$clockMinutes : $('.inset .minutes'),
		$clockSeconds : $('.inset .seconds'),
		$playStop : $('.play-stop'),
		timeCounter : 0,
		totalWorkSeconds : 0,
		totalBreakSeconds : 0,
		minutes : 25,
		seconds : 0,
		workingTime : 25,
		$workingTime : $('.working h3'),
		$workingPlus : $('.working .plus'),
		$workingMinus : $('.working .minus'),
		breakTime : 5,
		$breakTime : $('.break h3'),		
		$breakPlus : $('.break .plus'),
		$breakMinus : $('.break .minus'),

		// Circle properties
		$circle : $('.circle .fill, .circle .mask.full'),
		$circleFix : $('.circle .fill.fix'),
		$circleFill : $('.circle .fill'),
        circleColor : "#FFFFFF",

		// For Animation
		transform_styles : ['-webkit-transform',
                        '-ms-transform',
                        'transform'],
        rotationBase : 0,
        rotationAnimation : 0,

        // Sound
        sound : {},

		// Validators
		isWorking : false,
		isInBreak : false,

		prepare : function() {
			var self = this;

			this.sound = new Audio('http://www.orangefreesounds.com/wp-content/uploads/2015/04/Desk-bell-sound.mp3');

			this.$workingPlus.on("click", function() {
				self.workingTime += 1;
				self.$workingTime.html(self.workingTime);
				self.setMinutes(self.workingTime);
			});

			this.$workingMinus.on("click", function() {
				self.workingTime = self.workingTime == 1 ? 1 : self.workingTime - 1;
				self.$workingTime.html(self.workingTime);
				self.setMinutes(self.workingTime);	
			});

			this.$breakPlus.on("click", function() {
				self.breakTime += 1;
				self.$breakTime.html(self.breakTime);
			});

			this.$breakMinus.on("click", function() {
				self.breakTime = self.breakTime == 1 ? 1 : self.breakTime - 1;
				self.$breakTime.html(self.breakTime);
			});

			this.$workingPlus.add(this.$workingMinus).add(this.$breakPlus).add(this.$breakMinus).
			on("click", function() {
				self.stopTimer();
				self.resetProperties(self.workingTime);
				self.seconds = 0;
				self.$clockSeconds.html(self.fixTime(self.seconds));
				self.$playStop.find("span").removeClass("glyphicon-pause").addClass("glyphicon-play");
			});

			this.$playStop.on("click", function() {
				var icon = $(this).find("span");

				if (icon.hasClass("glyphicon-play")) {
					icon.removeClass("glyphicon-play").addClass("glyphicon-pause");
					self.startWorking();
				} else {
					icon.removeClass("glyphicon-pause").addClass("glyphicon-play");
					self.stopTimer();
				}
			});
		},

		setMinutes : function(minutes) {
			this.minutes = minutes;
			this.$clockMinutes.html(this.fixTime(this.minutes));
		},

		fixTime : function(value) {
			return value < 10 ? "0" + value : value;
		},

		startClock : function(global, limit) {
			
			global.$circleFill.css("background-color", global.circleColor);
			self = global;

			window.timer = setInterval(function() {

				if (self.seconds === 0) {
					self.minutes -= 1;
					self.seconds = 59;

					self.$clockMinutes.html(self.fixTime(self.minutes));

				} else {
					self.seconds -= 1;
				}
				
				self.$clockSeconds.html(self.fixTime(self.seconds));

				self.animatePomodoro();

				self.timeCounter += 1;

				if (self.timeCounter == limit || self.minutes < 0) {

					self.stopTimer();
					
					self.sound.play();

					if (self.isWorking) {
						self.isWorking = false;

						self.resetProperties(self.breakTime);
						self.totalBreakSeconds = self.breakTime * 60;
						self.isInBreak = true;
						self.circleColor = "#CBE867";
						self.rotationBase = 180 / self.totalBreakSeconds;
						self.startClock(self, self.totalBreakSeconds);
					} else if (self.isInBreak) {
						self.isInBreak = false;

						self.resetProperties(self.workingTime);
						self.totalWorkSeconds = self.workingTime * 60;
						self.rotationBase = 180 / self.totalWorkSeconds;
						self.isWorking = true;
						self.startClock(self, self.totalWorkSeconds);
					}					
				}

			}, 1000);
		},

		startWorking : function() {
			this.totalWorkSeconds = this.workingTime * 60;
			this.rotationBase = 180 / this.totalWorkSeconds;

			this.isWorking = true;


			this.startClock(this, this.totalWorkSeconds);			
		},

		animatePomodoro : function() {									
			Pomodoro.rotationAnimation += Pomodoro.rotationBase;
			var rotation = Pomodoro.rotationAnimation >= 180 ? 180 : Pomodoro.rotationAnimation;
			var fill_rotation = rotation;
			var fix_rotation = rotation * 2;

			for(var i in Pomodoro.transform_styles) {
				Pomodoro.$circle.css(Pomodoro.transform_styles[i],
					'rotate(' + fill_rotation + 'deg)');

				Pomodoro.$circleFix.css(Pomodoro.transform_styles[i],
		                             'rotate(' + fix_rotation + 'deg)');
			}
		},

		stopTimer : function() {
			clearTimeout(window.timer);
		},

		resetProperties : function(minutes) {
			Pomodoro.minutes = minutes;
			Pomodoro.seconds = 0;
			Pomodoro.timeCounter = 0;
			Pomodoro.rotationAnimation = 0;
			Pomodoro.circleColor = "#FFFFFF";
		}
	}

	Pomodoro.prepare();

})(window);