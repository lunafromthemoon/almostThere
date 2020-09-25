import 'regenerator-runtime/runtime'
import {initNEAR, login, logout, getProject, startProject, donateTo } from './blockchain'

window.getProject = getProject;
window.startProject = startProject;
window.donateTo = donateTo;

let accountId = null;

let campaign = {
    name: "Help me buy a new laptop",
    owner: "laptop.testnet",
    goal: 500,
    startDate: new Date(),
    endDate: "01/01/2021",
    totalDonations: 45,
    donations:[{from:"donnor1.testnet",total:5},{from:"donnor2.testnet",total:30},{from:"donnor3.testnet",total:10}]
}



$(document).ready(function() {

	// var config = {
 //    countdown: {
 //        year: 2021,
 //        month: 8,
 //        day: 24,
 //        hour: 10,
 //        minute: 55,
 //        second: 12
 //    }};
	
 //    var date = new Date(config.countdown.year,
 //                        config.countdown.month - 1,
 //                        config.countdown.day,
 //                        config.countdown.hour,
 //                        config.countdown.minute,
 //                        config.countdown.second),
        let $countdownNumbers = {
            days: $('#countdown-days'),
            hours: $('#countdown-hours'),
            minutes: $('#countdown-minutes'),
            seconds: $('#countdown-seconds')
        };
    $('#countdown').countdown(campaign.endDate, function(event) {
        $countdownNumbers.days.text(event.offset.totalDays);
        $countdownNumbers.hours.text(('0' + event.offset.hours).slice(-2));
        $countdownNumbers.minutes.text(('0' + event.offset.minutes).slice(-2));
        $countdownNumbers.seconds.text(('0' + event.offset.seconds).slice(-2));
    });

    // var ProgressBar = require('js/progressbar.js')
    var colorZero = "#ff334f";
    var colorComplete = "#55ff33";
    var colorTrail = '#eee';

    // var line = new ProgressBar.Line('#progressbar');
    progressbar = new ProgressBar.Circle('#progressbarPercentage', {
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
        }
    });

    progressbar.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
	progressbar.text.style.fontSize = '6rem';
	progressbar.text.style.color = '#FFF';
    
    moneyBar = new ProgressBar.Line('#progressbarMoney', {
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
	        var value = Math.round(moneyBar.value() * campaign.goal);
            $("#donations-info").html(`${value} Nears collected so far.`)
            $("#goal-info").html(`Only ${campaign.goal-value} more to reach the goal!`)
		    // moneyBar.text.style.color = state.color
	    },
    });

    if (!accountId){
        $("#not-logged").show();
        $("#logged").hide();
    } else {
        loggedInFlow();
    }
    updateBars()

});
window.nearInitPromise = initNEAR()
.then(connected => { if (connected) loginFlow()
                     else logoutFlow() })

function loggedInFlow(){
    $("#not-logged").hide();
    $("#logged").show();
}

window.login = function(){
    accountId = "lunafromthemoon.testnet";
    loggedInFlow();
}

window.addDonation = function(amount){
    var previousAmount = parseFloat($('#donation-input').val());
    if (isNaN(previousAmount)){
        previousAmount=0;
    }
    $('#donation-input').val(previousAmount+amount)
}

window.donate = function(){
    var amount = parseFloat($('#donation-input').val());
    if (!isNaN(amount)){
        campaign.donations.push({from:accountId,total:amount});
        campaign.totalDonations+=amount;
        updateBars();
    }
    
}

function updateBars(){
    var campaignProgress = 1 - (campaign.goal - campaign.totalDonations) / campaign.goal;
    console.log(campaignProgress)
    moneyBar.animate(campaignProgress);
    progressbar.animate(campaignProgress);
}
