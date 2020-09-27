import { connect, utils, Contract, keyStores, WalletConnection } from 'near-api-js'
import getConfig from './config'

const nearConfig = getConfig('development')
window.nearConfig = nearConfig

// ===== API =====

export function login() {
  window.walletConnection.requestSignIn(nearConfig.contractName)
}

export function logout() {
  window.walletConnection.signOut()
  // reload page
  window.location.replace(window.location.origin + window.location.pathname)
}

export async function initNEAR() {
  // Initialize connection to the NEAR testnet - CALL IT ON LOAD
  const near = await connect(
    Object.assign({deps:{keyStore: new keyStores.BrowserLocalStorageKeyStore()}},
                  nearConfig)
  )

  // Initializing Wallet based Account
  window.walletConnection = new WalletConnection(near)

  // Getting the Account ID
  window.accountId = window.walletConnection.getAccountId()

  // Initializing contract APIs
  window.contract = new Contract(
    window.walletConnection.account(),
    nearConfig.contractName,
    {viewMethods: [],
     changeMethods: ['startProject', 'donateTo', 'getProjectOf']}
  )
  return walletConnection.isSignedIn()
}

export async function startCampaign(timestamp_end, money_objective){
  let time_end = (timestamp_end*1000000).toString()
  money_objective = utils.format.parseNearAmount(money_objective.toString())
  return await contract.startProject({time_end, money_objective})
}

// CONTENT
// export async function getProject(id){
//   // Returns {id:string, time_init:timestamp, time_end:timestamp,
//   //          money_objective:u128, money_funded:u128, donors:list[Donor]}
//   // where
//   //         Donor = {id:string, amount:u128}
//   let project = await contract.getProjectOf({id})
//   if(!project){return}

//   project.time_init = project.time_init/1000000
//   project.time_end = project.time_end/1000000
//   project.money_objective = utils.format.formatNearAmount(project.money_objective).toString()
//   project.money_funded = utils.format.formatNearAmount(project.money_funded).toString()
  
//   for (let i=0; i<project.donors.length; i++){
//     project.donors[i].amount = utils.format.formatNearAmount(project.donors[i].amount).toString()
//   }

//   return project
// }

// export async function donateTo(id, money_amount){
//   // OPENS another webpage to pay
//   let amount = utils.format.parseNearAmount(money_amount.toString())
//   let account = window.walletConnection.account()
//   account.functionCall(nearConfig.contractName, 'donateTo', {id}, 0, amount)
// }



// SIA
// function generateUUID() {
//   let uuid = ''
//   const cs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
//   for (let i = 0; i < 16; i++) {
//     uuid += cs.charAt(Math.floor(Math.random() * cs.length))
//   }
//   return uuid;
// }

// export async function upload_file_to_sia(file){
//   const uuid = generateUUID()

//   var formData = new FormData()
//   formData.append("file", file)

//   let response = await fetch('https://siasky.net/skynet/skyfile/'+uuid,
//                              {method:"POST", body:formData})
//                 .then(response => response.json())
//                 .then(success => {return success.skylink})
//                 .catch(error => {console.log(error)})
//   return response
// }

// export async function upload_html_to_sia(new_html){
//   var blob = new Blob([new_html], {type:"text/html; charset=UTF-8"})

//   var formData = new FormData()
//   formData.append("file", blob)

//   const uuid = generateUUID()

//   let response = await fetch('https://siasky.net/skynet/skyfile/'+uuid,
//                              {method:"POST", body:formData})
//                  .then(response => response.json())
//                  .then(success => {return success.skylink})
//                  .catch(error => {console.log(error)})
//   return response
// }
