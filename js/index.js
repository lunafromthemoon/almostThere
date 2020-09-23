$(document).ready(function() {

	var config = {
    countdown: {
        year: 2021,
        month: 8,
        day: 24,
        hour: 10,
        minute: 55,
        second: 12
    }};
	
    var date = new Date(config.countdown.year,
                        config.countdown.month - 1,
                        config.countdown.day,
                        config.countdown.hour,
                        config.countdown.minute,
                        config.countdown.second),
        $countdownNumbers = {
            days: $('#countdown-days'),
            hours: $('#countdown-hours'),
            minutes: $('#countdown-minutes'),
            seconds: $('#countdown-seconds')
        };
    $('#countdown').countdown(date, function(event) {
        $countdownNumbers.days.text(event.offset.totalDays);
        $countdownNumbers.hours.text(('0' + event.offset.hours).slice(-2));
        $countdownNumbers.minutes.text(('0' + event.offset.minutes).slice(-2));
        $countdownNumbers.seconds.text(('0' + event.offset.seconds).slice(-2));
    });

    // var ProgressBar = require('js/progressbar.js')
    var campaignProgress = 0.7;
    var colorZero = "#ff334f";
    var colorComplete = "#55ff33";
    var colorTrail = '#eee';

    // var line = new ProgressBar.Line('#progressbar');
    var progressbar = new ProgressBar.Circle('#progressbarPercentage', {
        // color: '#FCB03C',
        duration: 3000,
        strokeWidth: 6,
        trailWidth: 1,
        easing: 'easeInOut',
        trailColor: colorTrail,
        from: { color: colorZero },
    	to: { color: colorComplete },
    	step: function(state, progressbar, attachment) {
	        progressbar.path.setAttribute('stroke', state.color);
	        var value = Math.round(progressbar.value() * 100);
		    if (value === 0) {
		      progressbar.setText('0%');
		    } else {
		      progressbar.setText(value+"%");
		    }
		    // progressbar.text.style.color = state.color
	    },
        svgStyle:{
        	height: '500px'
        },
        text: {
        	autoStyleContainer: false,
        	// style: {
        	// 	fontFamily: '"Raleway", Helvetica, sans-serif',
        	// 	fontSize: '2rem'
        	// }
        }
    });

    progressbar.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
	progressbar.text.style.fontSize = '6rem';
	progressbar.text.style.color = '#FFF';
    progressbar.animate(campaignProgress);

    var totalMoney = 5000;
    
    var moneyBar = new ProgressBar.Line('#progressbarMoney', {
        // color: '#FCB03C',
        duration: 3000,
        strokeWidth: 6,
        trailWidth: 1,
        easing: 'easeInOut',
        trailColor: colorTrail,
        from: { color: colorZero },
    	to: { color: colorComplete },
    	step: function(state, moneyBar, attachment) {
	        moneyBar.path.setAttribute('stroke', state.color);
	        var value = Math.round(moneyBar.value() * totalMoney);
		    if (value === 0) {
		      moneyBar.setText('Nothing collected yet!');
		    } else {
		      moneyBar.setText(value+" Nears collected!");
		    }
		    // moneyBar.text.style.color = state.color
	    },
        // svgStyle:{
        // 	height: '500px'
        // },
        text: {
        	autoStyleContainer: false,
        	// style: {
        	// 	fontFamily: '"Raleway", Helvetica, sans-serif',
        	// 	fontSize: '2rem'
        	// }
        }
    });

    moneyBar.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
	moneyBar.text.style.fontSize = '3rem';
	moneyBar.text.style.color = '#FFF';
    moneyBar.animate(campaignProgress);

});