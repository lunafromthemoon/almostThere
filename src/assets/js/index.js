import 'regenerator-runtime/runtime'
import {initNEAR, login, logout, startProject } from './blockchain'

window.login = login;
window.logout = logout;

$(document).ready(function() {
    window.accountId = null;
  	window.nearInitPromise = initNEAR()
  	.then(connected => { if (connected) loginFlow()
                       else logoutFlow() })
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

function uploadFilePreview(){
	// upload file in frontend and show preview
	if (this.files && this.files[0]) {
		if (this.files[0].type.includes('video')){
			var fileUrl = URL.createObjectURL(this.files[0]);
   			$(`#upload-video-preview`).attr('src', fileUrl);
      		$(`#upload-video-preview`).show();
		} else {
			var reader = new FileReader();
		    reader.onload = function(e) {
		      $(`#upload-image-preview`).attr('src', e.target.result);
      			$(`#upload-image-preview`).show();
		    }
		    reader.readAsDataURL(this.files[0]); // convert to base64 string
		}
	    
    }
}

$("#upload-image-input").change(uploadFilePreview)
$("#upload-video-input").change(uploadFilePreview)

