import 'regenerator-runtime/runtime'
import {initNEAR, login, logout, startProject, upload_file_to_sia, upload_html_to_sia } from './blockchain'

window.login = login;
window.logout = logout;

let previewTemplate = "https://siasky.net/GAD69XHlmukIiTXkG_7RSS4HyQHSvgZN5k42kWGf9YmasQ";

$(document).ready(function() {
  window.accountId = null;
	window.nearInitPromise = initNEAR()
	.then(connected => { if (connected) loginFlow()
                     else logoutFlow() });
  $('#when-input').datepicker({
    format: 'mm/dd/yyyy',
    startDate: new Date()
  });
})

function loginFlow(){
  $("#not-logged").hide();
  $("#logged").show();
  $("#username").html(accountId);
}

function logoutFlow(){
  $("#not-logged").show();
  $("#logged").hide();
  $("#logout-btn").hide();
}

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
  .done(async (data) => {
    // console.log(data)
    data = data.replace("TEMPLATE_OWNER",campaignData.owner);
    data = data.replace("TEMPLATE_TITLE",`Help ${campaignData.title.who} ${campaignData.title.what}`);
    data = data.replace("TEMPLATE_WHO",campaignData.title.who);
    data = data.replace("TEMPLATE_WHAT",campaignData.title.what);
    data = data.replace("TEMPLATE_IMAGE_BG",campaignData.image);
    data = data.replace("TEMPLATE_IMAGE",campaignData.image);
    data = data.replace("TEMPLATE_DESCRIPTION",campaignData.description);
    data = data.replace("TEMPLATE_VIDEO",campaignData.video);
    data = data.replace("TEMPLATE_GOAL",campaignData.goal);
    data = data.replace("TEMPLATE_DATE",campaignData.endDate);

    $("#preview-btn").html("Uploading preview "+spinner);
    let htmlLink = await upload_html_to_sia(data);
    $("#preview-btn").html('Check the preview');
    window.open('https://siasky.net/'+htmlLink,'_blank');

  });
}

$("#upload-image-input").change(uploadFilePreview)
$("#upload-video-input").change(uploadFilePreview)

