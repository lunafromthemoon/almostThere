
var fs = require('fs'); //Filesystem  
const { SkynetClient } = require('@nebulous/skynet');
const fetch = require('node-fetch');
const skynet = new SkynetClient();

function applyTemplate(template,vars){
	vars.forEach(v=>{
		let regex = new RegExp(v[0], 'g');
		template = template.replace(regex,v[1]);
	});
	return template;
}

function makeWeb(link){
	return link.replace("sia://","https://siasky.net/");
}

async function publish(){
	const webPath = "./www/";
	// console.log("Reading config")
	let configRaw = fs.readFileSync(webPath+"web-config.json");
	// console.log(configRaw)
	const webConfig = JSON.parse(configRaw);

	const CONTRACT_NAME = process.env.CONTRACT_NAME || 'almostThere'

	webConfig.nearConfig.push(["CONFIG_CONTRACT_NAME",CONTRACT_NAME])
	// console.log(CONTRACT_NAME);
	// console.log(webConfig);

	// upload resources
	console.log("Uploading resources");

	let uploads = [];
	webConfig.resources.forEach(resource => {
		console.log("Uploading "+resource[0])
		uploads.push(skynet.uploadFile(webPath+resource[1]))
	});

	let links = await Promise.all(uploads);
	// console.log(links);
	console.log("Resources uploaded");
	let resources = links.map((link,index)=>{return [webConfig.resources[index][0],makeWeb(link)]});
	// console.log(resources);
	// load templates and replace resources

	console.log("Processing templates");
	let templatePreview = fs.readFileSync(webPath+webConfig.templates.TEMPLATE_PREVIEW,"utf-8");
	let templateFinal = fs.readFileSync(webPath+webConfig.templates.TEMPLATE_FINAL,"utf-8");

	templatePreview = applyTemplate(templatePreview,resources);
	templateFinal = applyTemplate(templateFinal,resources);

	console.log("Uploading templates");
	fs.writeFileSync(webPath+'uploads/templatePreview.html', templatePreview);
	fs.writeFileSync(webPath+'uploads/templateFinal.html', templateFinal);

	uploads = [skynet.uploadFile(webPath+'uploads/templatePreview.html'),skynet.uploadFile(webPath+'uploads/templateFinal.html')];

	links = await Promise.all(uploads);
	// console.log(links);
	console.log("Templates uploaded");
	let templateLinks = [
		["TEMPLATE_PREVIEW",makeWeb(links[0])],
		["TEMPLATE_FINAL",makeWeb(links[1])]
	]
	console.log("Processing index");
	var webIndex = fs.readFileSync(webPath+webConfig.index,"utf-8");
	// add resources
	webIndex = applyTemplate(webIndex,resources);
	// add template links
	webIndex = applyTemplate(webIndex,templateLinks);
	// add near config
	webIndex = applyTemplate(webIndex,webConfig.nearConfig);

	console.log("Uploading index");
	fs.writeFileSync(webPath+'uploads/index.html', webIndex);

	let link = await skynet.uploadFile(webPath+'uploads/index.html')

	console.log("-------------------------------THE LINK----------------------------------")
	console.log(makeWeb(link))
	console.log("-------------------------------------------------------------------------")

	console.log("Saving all linksin uploads/published.json,  just in case.");
	links = {
		resources: resources,
		templates: templateLinks,
		index: makeWeb(link)
	}
	fs.writeFileSync(webPath+'uploads/published.json', JSON.stringify(links));
	if (webConfig.handshake){
		updateHandshake(webConfig.handshake,link);
	}
}

function updateHandshake(config, sialink){
	console.log("Updating handshake")
	const data = `{"access_key":"${config.accessKey}", "secret_key":"${config.secretKey}", "sialink":"${sialink}", "domain":"${config.domain}"}`
	opts = {method:'PUT', body:data, headers:{'Content-Type':'application/json'}}
	fetch('https://wakio.glitch.me/', opts)
	.then(result => result.json())
	.then(result => console.log(result))
	.catch(err => console.error('error', err)) 
}

console.log("Deploying web to SIA");
publish()


