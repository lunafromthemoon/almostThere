

$(document).ready(function() {
  window.accountId = null;

  $('#when-input').datepicker({
    format: 'mm/dd/yyyy',
    startDate: new Date()
  });

  $("#upload-image-input").change(uploadFilePreview)
  $("#upload-video-input").change(uploadFilePreview)

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

  window.previewTemplate = $('meta[name=previewTemplate]').attr("content");
  window.finalTemplate = $('meta[name=finalTemplate]').attr("content");

  initNear().then(connected => { 
    if (connected) {
      $("#not-logged").hide();
      $("#logged").show();
      $("#username").html(accountId);
    } else {
      $("#not-logged").show();
      $("#logged").hide();
      $("#logout-btn").hide();
    };
  });
})

const spinner = '<i class="fa fa-spinner fa-pulse fa-fw"></i>'

async function uploadFilePreview(){
	// upload file in frontend and show preview
	if (this.files && this.files[0]) {
    let prev = "";
    if (this.files[0].type.includes('video')){
      prev = $("#video-btn").html();
      $("#video-btn").html(spinner)
    } else {
      prev = $("#img-btn").html();
      $("#img-btn").html(spinner)
    }
    let link = await upload_file_to_sia(this.files[0]);
		if (this.files[0].type.includes('video')){
 			$(`#upload-video-preview`).attr('src', 'https://siasky.net/'+link);
  		$(`#upload-video-preview`).show();
      $("#video-btn").html(prev)
		} else {
			var reader = new FileReader();
      $(`#upload-image-preview`).attr('src', 'https://siasky.net/'+link);
			$(`#upload-image-preview`).show();
      $("#img-btn").html(prev)
		}
	    
  }
}

function validateCampaign(){
  let errors = [];
  let campaignData = {
    owner: accountId,
    title: {
      who: $("#who-input").val(),
      what: $("#what-input").val()
    },
    description: $("#campaign-description-input").val(),
    goal: parseFloat($("#how-much-input").val()),
    endDate: $("#when-input").val(),
    image: $(`#upload-image-preview`).attr('src'),
    video: $(`#upload-video-preview`).attr('src')
  }
  if (!campaignData.title.who || !campaignData.title.what){
    errors.push("The campaign is missing a complete title.");
  }
  if (!campaignData.description){
    errors.push("The campaign is missing a description.");
  }
  if (!campaignData.goal){
    errors.push("The campaign is missing a goal amount.");
  }
  if (!campaignData.endDate){
    errors.push("The campaign is missing an ending date.");
  }
  if (!campaignData.image){
    errors.push("The campaign is missing the main image");
  }
  if (!campaignData.video){
    errors.push("The campaign is missing the main video");
  }
  if (errors.length){
    var errorString = "<strong>There are some errors!</strong>";
    errors.forEach(error=>{
      errorString+="<br>- "+error;
    });
    $("#error-message").html(errorString);
    $(".error-warning").show(500)
    return null;
  } else {
    $(".error-warning").hide()
    return campaignData;
  }
}

window.previewCampaign =  function(){
  
  let campaignData = validateCampaign();
  if (!campaignData){
    // campaign error
    return 
  }

  $("#preview-btn").html("Creating preview "+spinner);

  $.get(previewTemplate)
  .done(async (template) => {
    // console.log(data)
    let html = applyTemplate(template,campaignData);

    $("#preview-btn").html("Uploading preview "+spinner);
    let htmlLink = await upload_html_to_sia(html);
    $("#preview-btn").html('Check the preview');
    $("#publish-btn").show();
    window.open('https://siasky.net/'+htmlLink,'_blank');

  });
}

window.publishCampaign = async function(){
  
  let campaignData = validateCampaign();
  if (!campaignData){
    // campaign error
    $("#publish-btn").hide();
    return 
  }

  $("#publish-btn").html("Creating campaign "+spinner);

  let campaignId = await startCampaign(new Date(campaignData.endDate).getTime(),campaignData.goal)
  // console.log(campaignId)
  if (campaignId){
    campaignData.id = campaignId;
    $.get(finalTemplate).done(async (template) => {
      // console.log(data)
      let html = applyTemplate(template,campaignData);

      $("#publish-btn").html("Publishing "+spinner);
      let htmlLink = await upload_html_to_sia(html);
      $("#preview-btn").hide();
      $("#publish-btn").hide();
      $("#open-btn").attr("href",'https://siasky.net/'+htmlLink);
      $("#published-link").val('https://siasky.net/'+htmlLink);
      $("#published").show();
      // $("#publish-btn").show();
      window.open('https://siasky.net/'+htmlLink,'_blank');

    });
  } else {
    alert("error de id")
  }
  
}

function applyTemplate(template,data){
  if (data.id){
    template = template.replace("CONFIG_CAMPAIGN_ID",data.id);
    template = template.replace("CONFIG_CONTRACT_NAME",nearConfig.contractName);
    template = template.replace("CONFIG_NETWORK_ID",nearConfig.networkId);
    template = template.replace("CONFIG_NODE_URL",nearConfig.nodeUrl);
    template = template.replace("CONFIG_WALLET_URL",nearConfig.walletUrl);
    template = template.replace("CONFIG_HELPER_URL",nearConfig.helperUrl);
    template = template.replace("CONFIG_EXPLORER_URL",nearConfig.explorerUrl);
  }
  template = template.replace("TEMPLATE_OWNER",data.owner);
  template = template.replace("TEMPLATE_TITLE",`Help ${data.title.who} ${data.title.what}`);
  template = template.replace("TEMPLATE_WHO",data.title.who);
  template = template.replace("TEMPLATE_WHAT",data.title.what);
  template = template.replace("TEMPLATE_IMAGE_BG",data.image);
  template = template.replace("TEMPLATE_IMAGE",data.image);
  template = template.replace("TEMPLATE_META_IMAGE",data.image);
  template = template.replace("TEMPLATE_DESCRIPTION",data.description);
  template = template.replace("TEMPLATE_VIDEO",data.video);
  template = template.replace("TEMPLATE_GOAL",data.goal);
  template = template.replace("TEMPLATE_DATE",data.endDate);
  return template;
}

// NEAR connection

async function initNear(){

  // read config

  window.nearConfig = {
    networkId: $('meta[name=contractName]').attr("content"),
    nodeUrl: $('meta[name=nodeUrl]').attr("content"),
    contractName: $('meta[name=contractName]').attr("content"),
    walletUrl: $('meta[name=walletUrl]').attr("content"),
    helperUrl: $('meta[name=helperUrl]').attr("content"),
    explorerUrl: $('meta[name=explorerUrl]').attr("content"),
  }

  // login and logout functions

  window.login = function login() {
    window.walletConnection.requestSignIn(nearConfig.contractName)
  }
  window.logout = function logout() {
    window.walletConnection.signOut()
    // reload page
    window.location.replace(window.location.origin + window.location.pathname)
  }

  // init Near

  const near = await nearApi.connect(Object.assign({
    deps:{
      keyStore: new nearApi.keyStores.BrowserLocalStorageKeyStore()
    }}, nearConfig)
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

async function startCampaign(timestamp_end, goal){
  let time_end = (timestamp_end*1000000).toString()
  money_objective = nearApi.utils.format.parseNearAmount(goal.toString())
  return await contract.startProject({time_end, money_objective})
}

// SIA connection

function generateUUID() {
  let uuid = ''
  const cs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < 16; i++) {
    uuid += cs.charAt(Math.floor(Math.random() * cs.length))
  }
  return uuid;
}

async function upload_file_to_sia(file){
  const uuid = generateUUID()

  var formData = new FormData()
  formData.append("file", file)

  let response = await fetch('https://siasky.net/skynet/skyfile/'+uuid,
                             {method:"POST", body:formData})
                .then(response => response.json())
                .then(success => {return success.skylink})
                .catch(error => {console.log(error)})
  return response
}

async function upload_html_to_sia(new_html){
  var blob = new Blob([new_html], {type:"text/html; charset=UTF-8"})

  var formData = new FormData()
  formData.append("file", blob)

  const uuid = generateUUID()

  let response = await fetch('https://siasky.net/skynet/skyfile/'+uuid,
                             {method:"POST", body:formData})
                 .then(response => response.json())
                 .then(success => {return success.skylink})
                 .catch(error => {console.log(error)})
  return response
}