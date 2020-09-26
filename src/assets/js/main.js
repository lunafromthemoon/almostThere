
import 'regenerator-runtime/runtime'
import {initNEAR, login, logout, getProject, donateTo } from './blockchain'

window.getProject = getProject;
window.donateTo = donateTo;

let ProgressBar = require('progressbar.js');

let campaign = {
    name: "Help me buy a new laptop",
    owner: "laptop.testnet",
    goal: 1500,
    startDate: new Date(),
    endDate: "01/01/2021",
    totalDonations: 415,
    donations:[
      {from:"donnor1.testnet",total:5},
      {from:"medium.testnet",total:30},
      {from:"bigdonnor.testnet",total:50},
      {from:"stardonnor.testnet",total:150},
      {from:"donnor3.testnet",total:10},
      {from:"donnor4.testnet",total:10},
      {from:"donnor5.testnet",total:10},
      {from:"donnor6.testnet",total:10},
      {from:"donnor7.testnet",total:10},
      {from:"donnor8.testnet",total:10},
      {from:"donnor9.testnet",total:10},
      {from:"donnor10.testnet",total:10},
      {from:"donnor11.testnet",total:10},
      {from:"donnor12.testnet",total:10},
      {from:"donnor13.testnet",total:10},
      {from:"donnor14.testnet",total:10},
      {from:"donnor15.testnet",total:10},
      {from:"donnor16.testnet",total:10},
      {from:"donnor17.testnet",total:10},
      {from:"donnor18.testnet",total:10},
      {from:"donnor19.testnet",total:10},
      {from:"donnor20.testnet",total:10},
      ]
}

let progressbar,moneyBar;

function initPage(){
  window.accountId = null;
  window.nearInitPromise = initNEAR()
  .then(connected => { if (connected) loginFlow()
                       else logoutFlow() })
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
  initBars();
  initDonnors();
  
}

function initDonnors(){
  var isDonnor = false;
  $("#donnors").html("")
  campaign.donations.forEach(donnor=>{
    var donnorClass = "small-donnor";
    if (donnor.from == accountId){
      isDonnor = true;
      donnorClass = "star-donnor";
    } else if (donnor.total >=100){
      donnorClass="star-donnor"
    } else if (donnor.total >= 50){
      donnorClass="big-donnor"
    } else if (donnor.total >= 15){
      donnorClass="medium-donnor"
    }
    $("#donnors").append(`<span class="${donnorClass}"> ${donnor.from} </span>`);
  });
  if (isDonnor){
    $("#supporters-section h3").html("This campaign will be a success thanks to you!<br><br>Thanks for your donation!</h3>");
  }
}

function initBars(){
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
            $("#donations-info span").html(value)
            $("#goal-info").html(`Only ${campaign.goal-value} more to the goal!`)
        // moneyBar.text.style.color = state.color
      },
    });
}

window.updateBars = function updateBars(force){
    var campaignProgress = 1 - (campaign.goal - campaign.totalDonations) / campaign.goal;
    if (campaignProgress > 1) campaignProgress = 1;
    if (moneyBar.value() == 0 || force){
      moneyBar.animate(campaignProgress);
      progressbar.animate(campaignProgress,function(){
        if (campaign.goal <= campaign.totalDonations){
          $("#donations-info span").html(campaign.totalDonations);
          $( "#goal-info" ).effect( "drop", {}, 500, ()=>{
            $("#goal-info").html(`Goal reached and surpassed!`)
            $( "#goal-info" ).removeAttr( "style" ).hide().fadeIn();
            $("#goal-info").css("color","#f82249")
            progressbar.text.style.color = "#f82249"
          }) ;
          
        }
      });
    }
    
}

function loginFlow(){
  $("#not-logged").hide();
  $("#logged").show();
  $("#username").html(accountId);
  initDonnors();
}

function logoutFlow(){
  $("#not-logged").show();
  $("#logged").hide();
  $("#logout-btn").hide();
}

window.login = login;
window.logout = logout;

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
        updateBars(true);
    }
    
}

 $(document).ready(function() {
    initPage();
  })

