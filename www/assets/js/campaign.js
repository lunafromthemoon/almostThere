
  const CAMPAIGN_ID = $('meta[name=campaign-id]').attr("content");
  const nearConfig = {
        networkId: $('meta[name=networkId]').attr("content"),
        nodeUrl: $('meta[name=nodeUrl]').attr("content"),
        contractName: $('meta[name=contractName]').attr("content"),
        walletUrl: $('meta[name=walletUrl]').attr("content"),
        helperUrl: $('meta[name=helperUrl]').attr("content"),
        explorerUrl: $('meta[name=explorerUrl]').attr("content"),
      }


  // getConfig('development',CONTRACT_NAME)

  window.login = function login() {
    window.walletConnection.requestSignIn(nearConfig.contractName)
  }

  window.logout = function logout() {
    window.walletConnection.signOut()
    window.location.replace(window.location.origin + window.location.pathname)
  }

  let progressbar,moneyBar;
  let totalDonations = 0;
  $(document).ready(function() {
    window.nearInitPromise = initNEAR(nearConfig).then(connected => { 
      if (connected) {
        loginFlow();
      } else {
        logoutFlow();
      }
     })
    initCountdown();
    initNearExchanger();
  });

  function loginFlow(){
    getCampaign(CAMPAIGN_ID).then(campaign=>{
      window.campaign = campaign;
      if (!campaign){
        // campaign is finished
      } else {
        initBars();
        initDonors();
      }
    });
    $(".not-logged").hide();
    $(".logged").show();
    $("#username").html(accountId);
  }

  function logoutFlow(){
    $(".not-logged").show();
    $(".logged").hide();
  }

  function initCountdown() {
   let $countdownNumbers = {
      days: $('#countdown-days'),
      hours: $('#countdown-hours'),
      minutes: $('#countdown-minutes'),
      seconds: $('#countdown-seconds')
    };
    var endDate = $('#countdown').attr('target-date');
    $('#countdown').countdown(endDate, function(event) {
      $countdownNumbers.days.text(event.offset.totalDays);
      $countdownNumbers.hours.text(('0' + event.offset.hours).slice(-2));
      $countdownNumbers.minutes.text(('0' + event.offset.minutes).slice(-2));
      $countdownNumbers.seconds.text(('0' + event.offset.seconds).slice(-2));
    });
  }

  function initNearExchanger(){
    // NEAR value
    $.get( "https://api.coingecko.com/api/v3/simple/price?ids=near&vs_currencies=usd,jpy,eur,gbp,bch", function( data ) {
      window.currencyData = data.near;
      updateNearValue()
    });
    window.showFiatExchange = function(){
      $("#fiat-exchange").show();
    }

    window.changeFiat = function(fiat){
      $(".currency-input-append").html(fiat.toUpperCase());
      if ($("#near-currency").val()){
        updateNearValue();
      }
    }

    function updateFiatValue(){
      nearValue = $("#near-currency").val();
      if (isNaN(nearValue)){
        $("#fiat-currency").val(1);
        nearValue = 1;
      }
      let fiat = $(".currency-input-append").html().toLowerCase();
      let exchange = currencyData[fiat];
      let fiatValue = nearValue*exchange;
      $("#fiat-currency").val(Math.round((fiatValue + Number.EPSILON) * 100) / 100)
    }

    function updateNearValue(){
      let fiatValue = parseFloat($("#fiat-currency").val());
      if (isNaN(fiatValue)){
        $("#fiat-currency").val(1);
        fiatValue = 1;
      }
      let fiat = $(".currency-input-append").html().toLowerCase();
      let exchange = currencyData[fiat];
      let nearValue = fiatValue/exchange;
      $("#near-currency").val(Math.round((nearValue + Number.EPSILON) * 100) / 100)
    }

    $("#fiat-currency").on('input',updateNearValue);
    $("#near-currency").on('input',updateFiatValue);
  }

  const star = '<i class="fa fa-paper-plane-o"></i>';

  function initDonors(){
    let donations = campaign ? campaign.donors : []
    var isDonor = false;
    $("#donors").html("")
    donations.forEach(donor=>{
      var donorClass = "small-donor";
      if (donor.amount >=20 || donor.id == accountId){
        donorClass="star-donor"
        donor.id = donor.id+star
      } else if (donor.amount >= 10){
        donorClass="big-donor"
      } else if (donor.amount >= 5){
        donorClass="medium-donor"
      }
      $("#donors").append(`<span class="${donorClass}"> ${donor.id} </span>`);
    });
    if (isDonor){
      $("#supporters-section h3").html("This campaign will be a success thanks to you!<br><br>Thanks for your donation!</h3>");
    }
  }

  function initBars(){
    var colorZero = "#3277a8";
    var colorComplete = "#f82249";
    var colorTrail = '#eee';

    var campaignGoal = parseFloat($("#donate-section").attr("campaign-goal"));

    progressbar = new ProgressBar.Circle('#progressbarPercentage', {
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
        duration: 3000,
        strokeWidth: 6,
        trailWidth: 1,
        easing: 'easeInOut',
        trailColor: colorTrail,
        from: { color: colorZero },
      to: { color: colorComplete },
      step: function(state, moneyBar, attachment) {
          moneyBar.path.setAttribute('stroke', state.color);
          var value = Math.round(moneyBar.value() * campaignGoal);
            $("#donations-info span").html(value)
            $("#goal-info").html(`Only ${campaignGoal-value} more to the goal!`)
      },
    });
  }

  window.updateBars = function updateBars(force){
    var campaignGoal = parseFloat($("#donate-section").attr("campaign-goal"));
    if (campaign){
      totalDonations = campaign.money_funded;
    }
    var campaignProgress = 1 - (campaignGoal - totalDonations) / campaignGoal;
    if (campaignProgress > 1) campaignProgress = 1;
    if (moneyBar.value() == 0 || force){
      moneyBar.animate(campaignProgress);
      progressbar.animate(campaignProgress,function(){
        if (campaignGoal <= totalDonations){
          $("#donations-info span").html(totalDonations);
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
        donateTo(CAMPAIGN_ID,amount);
    }
  }

  // near connection

  async function initNEAR(nearConfig) {
    // Initialize connection to the NEAR testnet - CALL IT ON LOAD
    const near = await nearApi.connect(
      Object.assign({deps:{keyStore: new nearApi.keyStores.BrowserLocalStorageKeyStore()}},
                    nearConfig)
    )

    // Initializing Wallet based Account
    window.walletConnection = new nearApi.WalletConnection(near)

    // Getting the Account ID
    window.accountId = window.walletConnection.getAccountId()

    // Initializing contract APIs
    window.contract = new nearApi.Contract(
      window.walletConnection.account(),
      nearConfig.contractName,
      {viewMethods: [],
       changeMethods: ['startProject', 'donateTo', 'getProjectOf']}
    )
    return walletConnection.isSignedIn()
  }

  async function getCampaign(id){
    // Returns {id:string, time_init:timestamp, time_end:timestamp,
    //          money_objective:u128, money_funded:u128, donors:list[Donor]}
    // where
    //         Donor = {id:string, amount:u128}
    let project = await contract.getProjectOf({id})
    if(!project){return}

    project.time_init = project.time_init/1000000
    project.time_end = project.time_end/1000000
    project.money_objective = nearApi.utils.format.formatNearAmount(project.money_objective).toString()
    project.money_funded = nearApi.utils.format.formatNearAmount(project.money_funded).toString()
    
    for (let i=0; i<project.donors.length; i++){
      project.donors[i].amount = nearApi.utils.format.formatNearAmount(project.donors[i].amount).toString()
    }

    return project
  }

  async function donateTo(id, money_amount){
    // OPENS another webpage to pay
    let amount = nearApi.utils.format.parseNearAmount(money_amount.toString())
    let account = window.walletConnection.account()
    account.functionCall(nearConfig.contractName, 'donateTo', {id}, 0, amount)
  }

  function getConfig(env,contractName) {
    switch (env) {

    case 'production':
    case 'mainnet':
      return {
        networkId: 'mainnet',
        nodeUrl: 'https://rpc.mainnet.near.org',
        contractName: contractName,
        walletUrl: 'https://wallet.near.org',
        helperUrl: 'https://helper.mainnet.near.org',
        explorerUrl: 'https://explorer.mainnet.near.org',
      }
    case 'development':
    case 'testnet':
      return {
        networkId: 'testnet',
        nodeUrl: 'https://rpc.testnet.near.org',
        contractName: contractName,
        walletUrl: 'https://wallet.testnet.near.org',
        helperUrl: 'https://helper.testnet.near.org',
        explorerUrl: 'https://explorer.testnet.near.org',
      }
    }
  }

