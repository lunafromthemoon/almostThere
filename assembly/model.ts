import { PersistentMap, u128 } from "near-sdk-as";

// MAP user-id -> list of donors
@nearBindgen
export class Donor {
  constructor(public id:string, public amount:u128){}
}

@nearBindgen
export class DonorList {
  constructor(public donors: Array<Donor>) {}
}

export const project_donors = new PersistentMap<string, DonorList>("Don")

// Map user-id -> its project
@nearBindgen
export class Project {
  constructor(public id:string, public owner:string, public time_init:u128,
              public time_end:u128, public money_objective: u128,
              public money_funded:u128=u128.from(0),
              public donors:Array<Donor>=[]){}
}

export const projects = new PersistentMap<string, Project>("Proj")
