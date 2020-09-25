
// import { ProgressBar } from './progressbar'
var ProgressBar = require('progressbar.js');
/**
* Template Name: TheEvent - v2.2.0
* Template URL: https://bootstrapmade.com/theevent-conference-event-bootstrap-template/
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/



// let accountId = "medium.testnet";
let accountId = null;

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
  if (!accountId){
      $("#not-logged").show();
      $("#logged").hide();
  } else {
      loggedInFlow();
  }
}

function initDonnors(){
  var isDonnor = false;
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

function updateBars(force){
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
        updateBars(true);
    }
    
}

!(function($) {
  "use strict";

  // Back to top button
  $(window).scroll(function() {
    if ($(this).scrollTop() > 100) {
      $('.back-to-top').fadeIn('slow');
    } else {
      $('.back-to-top').fadeOut('slow');
    }
  });
  $('.back-to-top').click(function() {
    $('html, body').animate({
      scrollTop: 0
    }, 1500, 'easeInOutExpo');
    return false;
  });

  // Header fixed on scroll
  $(window).scroll(function() {
    if ($(this).scrollTop() > 100) {
      $('#header').addClass('header-scrolled');
    } else {
      $('#header').removeClass('header-scrolled');
    }
  });

  if ($(window).scrollTop() > 100) {
    $('#header').addClass('header-scrolled');
  }

  // Initialize Venobox
  $(window).on('load', function() {
    $('.venobox').venobox({
      bgcolor: '',
      overlayColor: 'rgba(6, 12, 34, 0.85)',
      closeBackground: '',
      closeColor: '#fff',
      share: false
    });
  });

  // Initiate superfish on nav menu
  $('.nav-menu').superfish({
    animation: {
      opacity: 'show'
    },
    speed: 400
  });

  // Mobile Navigation
  if ($('#nav-menu-container').length) {
    var $mobile_nav = $('#nav-menu-container').clone().prop({
      id: 'mobile-nav'
    });
    $mobile_nav.find('> ul').attr({
      'class': '',
      'id': ''
    });
    $('body').append($mobile_nav);
    $('body').prepend('<button type="button" id="mobile-nav-toggle"><i class="fa fa-bars"></i></button>');
    $('body').append('<div id="mobile-body-overly"></div>');
    $('#mobile-nav').find('.menu-has-children').prepend('<i class="fa fa-chevron-down"></i>');

    $(document).on('click', '.menu-has-children i', function(e) {
      $(this).next().toggleClass('menu-item-active');
      $(this).nextAll('ul').eq(0).slideToggle();
      $(this).toggleClass("fa-chevron-up fa-chevron-down");
    });

    $(document).on('click', '#mobile-nav-toggle', function(e) {
      $('body').toggleClass('mobile-nav-active');
      $('#mobile-nav-toggle i').toggleClass('fa-times fa-bars');
      $('#mobile-body-overly').toggle();
    });

    $(document).click(function(e) {
      var container = $("#mobile-nav, #mobile-nav-toggle");
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        if ($('body').hasClass('mobile-nav-active')) {
          $('body').removeClass('mobile-nav-active');
          $('#mobile-nav-toggle i').toggleClass('fa-times fa-bars');
          $('#mobile-body-overly').fadeOut();
        }
      }
    });
  } else if ($("#mobile-nav, #mobile-nav-toggle").length) {
    $("#mobile-nav, #mobile-nav-toggle").hide();
  }

  // Smooth scroll for the navigation menu and links with .scrollto classes
  var scrolltoOffset = $('#header').outerHeight() - 21;
  if (window.matchMedia("(max-width: 991px)").matches) {
    scrolltoOffset += 20;
  }
  $(document).on('click', '.nav-menu a, #mobile-nav a, .scrollto', function(e) {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      if (target.length) {
        e.preventDefault();


        var scrollto = target.offset().top - scrolltoOffset;

        if ($(this).attr("href") == '#header') {
          scrollto = 0;
        }

        $('html, body').animate({
          scrollTop: scrollto
        }, 1500, 'easeInOutExpo');

        if ($(this).parents('.nav-menu').length) {
          $('.nav-menu .menu-active').removeClass('menu-active');
          $(this).closest('li').addClass('menu-active');
        }

        if ($('body').hasClass('mobile-nav-active')) {
          $('body').removeClass('mobile-nav-active');
          $('#mobile-nav-toggle i').toggleClass('fa-times fa-bars');
          $('#mobile-body-overly').fadeOut();
        }
        return false;
      }
    }
  });

  // Activate smooth scroll on page load with hash links in the url
  $(document).ready(function() {
    if (window.location.hash) {
      var initial_nav = window.location.hash;
      if ($(initial_nav).length) {
        var scrollto = $(initial_nav).offset().top - scrolltoOffset;
        $('html, body').animate({
          scrollTop: scrollto
        }, 1500, 'easeInOutExpo');
      }
    }
    initPage();

  });

  // Navigation active state on scroll
  var nav_sections = $('section');
  var main_nav = $('.nav-menu, #mobile-nav');

  $(window).on('scroll', function() {
    var cur_pos = $(this).scrollTop() + 200;

    nav_sections.each(function() {
      var top = $(this).offset().top,
        bottom = top + $(this).outerHeight();

      if (cur_pos >= top && cur_pos <= bottom) {
        if (cur_pos <= bottom) {
          main_nav.find('li').removeClass('menu-active');
        }
        main_nav.find('a[href="#' + $(this).attr('id') + '"]').parent('li').addClass('menu-active');
        if ($(this).attr('id') == "donate-section"){
          updateBars()
        }
      }
      if (cur_pos < 300) {
        $(".nav-menu li:first").addClass('menu-active');
      }
    });
  });


  // Init AOS
  function aos_init() {
    AOS.init({
      duration: 1000,
      once: true
    });
  }
  $(window).on('load', function() {
    aos_init();
  });

})(jQuery);