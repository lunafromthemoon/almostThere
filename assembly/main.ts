import {context, env, u128, logging, ContractPromiseBatch} from "near-sdk-as";
import {Project, Donor, DonorList, projects, project_donors} from "./model"

function getDonors(id:string):Array<Donor>{
  let pdonors = project_donors.get(id)
  if (!pdonors){return []}
  return pdonors.donors
}

function addDonor(project_id:string, donor_id:string, amount:u128):void{
  let pdonors = project_donors.get(project_id)
  let donors: Array<Donor>

  if (!pdonors){donors = new Array<Donor>()}
  else{donors=pdonors.donors}

  donors.push(new Donor(donor_id, amount))
  let new_list = new DonorList(donors)
  project_donors.set(project_id, new_list)
}

export function getProjectOf(id:string): Project | null{
  let project = projects.get(id)

  if (!project){return null}
  
  // Add donors list
  let donor_list = getDonors(id)
  project.donors = donor_list

  // Check if it's finished
  checkAndDistribute(project)

  return project
}

export function startProject(time_end:string, money_objective:u128):string{
  let ftime:u128 = u128.from(time_end)
  let now:u128 = u128.from(env.block_timestamp())
  let id:string = context.sender + "-" + now.toString()
  
  // Create new project
  let project = new Project(id, context.sender, now, ftime, money_objective)
  projects.set(id, project)
  return id
}

function checkAndDistribute(project:Project):void{
  // Check if the project is still running, if not, handle the money

  let now:u128 = u128.from(env.block_timestamp())
  if(project.time_end >= now){return} // Didn't finished yet
 
  let pdonors: Array<Donor> = project.donors

  if(project.money_objective <= project.money_funded){
    ContractPromiseBatch.create(project.owner).transfer(project.money_funded)
  }else{
    // Return money to each donor
    for (let i = 0; i < pdonors.length; i++){
      ContractPromiseBatch.create(pdonors[i].id).transfer(pdonors[i].amount)
    }
  }
}

export function donateTo(id: string): void {
  let project = projects.get(id)
  let amount: u128 = context.attachedDeposit
  if(!project){
    // Not a project -> return money
    ContractPromiseBatch.create(context.sender).transfer(amount)
    return
  }
  
  let now:u128 = u128.from(env.block_timestamp())
  if(project.time_end <= now){
    // Project finished -> return money
    ContractPromiseBatch.create(context.sender).transfer(amount)
    return
  }

  // Add to list, and update project
  addDonor(id, context.sender, amount)
  let funded:u128 = u128.add(project.money_funded, amount)
  let updated_project = new Project(project.id, project.owner,
                                    project.time_init, project.time_end,
                                    project.money_objective, funded, [])

  projects.set(project.id, updated_project)
}
