export const u78Teams = ["Peninsular Raiders","Central Coast Strikers","Southern U8/1","Flaming Foxes","Young Guns","GIRLS TBC"];

export const u910Teams = ["Sand Tigers","Raving Roosters U9","Southern Lakes United U9","The Dinosaurs","The Goats","Barnyard Fowls U9","The Gunners","Repetech","TUFC U9 B1","Chicken Nuggets"];

export const u1112Groups = {
  A: ["Woy Woy U11A2","Feisty Sharks U11","Coastal United","Turf Pandas 2.0"],
  B: ["Avoca FC U11","Rebel Roar","Terrigal 11A1","TBC"],
};

export const completionTargets = { u78: 15, u910: 20, u1112A: 6, u1112B: 6, u910TopSemi: 2, u1112KO: 4 };

export const timeOrder = ["8:00","8:20","8:40","9:00","9:20","9:40","10:00","10:20","10:40","11:00","11:20","11:40"];
export const pitchOrder = ["Pitch 1","Pitch 2","Pitch 3","Pitch 4","Pitch 5","Pitch 6"];

export const initialFixtures = [
  { id:"u78-r1-1", age:"U7/8", stage:"League", round:"Round 1", time:"8:00", pitch:"Pitch 1", home:"Peninsular Raiders", away:"GIRLS TBC", competitionKey:"u78" },
  { id:"u78-r1-2", age:"U7/8", stage:"League", round:"Round 1", time:"8:00", pitch:"Pitch 2", home:"Central Coast Strikers", away:"Young Guns", competitionKey:"u78" },
  { id:"u78-r1-3", age:"U7/8", stage:"League", round:"Round 1", time:"8:00", pitch:"Pitch 3", home:"Southern U8/1", away:"Flaming Foxes", competitionKey:"u78" },
  { id:"u910-r1-1", age:"U9/10", stage:"League", round:"Round 1", time:"8:00", pitch:"Pitch 4", home:"Sand Tigers", away:"Chicken Nuggets", competitionKey:"u910" },

  { id:"u910-r1-2", age:"U9/10", stage:"League", round:"Round 1", time:"8:20", pitch:"Pitch 1", home:"Raving Roosters U9", away:"TUFC U9 B1", competitionKey:"u910" },
  { id:"u910-r1-3", age:"U9/10", stage:"League", round:"Round 1", time:"8:20", pitch:"Pitch 2", home:"Southern Lakes United U9", away:"Repetech", competitionKey:"u910" },
  { id:"u910-r1-4", age:"U9/10", stage:"League", round:"Round 1", time:"8:20", pitch:"Pitch 3", home:"The Dinosaurs", away:"The Gunners", competitionKey:"u910" },
  { id:"u910-r1-5", age:"U9/10", stage:"League", round:"Round 1", time:"8:20", pitch:"Pitch 4", home:"The Goats", away:"Barnyard Fowls U9", competitionKey:"u910" },

  { id:"u78-r2-1", age:"U7/8", stage:"League", round:"Round 2", time:"8:40", pitch:"Pitch 1", home:"Peninsular Raiders", away:"Young Guns", competitionKey:"u78" },
  { id:"u78-r2-2", age:"U7/8", stage:"League", round:"Round 2", time:"8:40", pitch:"Pitch 2", home:"GIRLS TBC", away:"Flaming Foxes", competitionKey:"u78" },
  { id:"u78-r2-3", age:"U7/8", stage:"League", round:"Round 2", time:"8:40", pitch:"Pitch 3", home:"Central Coast Strikers", away:"Southern U8/1", competitionKey:"u78" },
  { id:"u910-r2-1", age:"U9/10", stage:"League", round:"Round 2", time:"8:40", pitch:"Pitch 4", home:"Raving Roosters U9", away:"The Gunners", competitionKey:"u910" },

  { id:"u910-r2-2", age:"U9/10", stage:"League", round:"Round 2", time:"9:00", pitch:"Pitch 1", home:"Sand Tigers", away:"TUFC U9 B1", competitionKey:"u910" },
  { id:"u910-r2-3", age:"U9/10", stage:"League", round:"Round 2", time:"9:00", pitch:"Pitch 2", home:"Southern Lakes United U9", away:"Chicken Nuggets", competitionKey:"u910" },
  { id:"u910-r2-4", age:"U9/10", stage:"League", round:"Round 2", time:"9:00", pitch:"Pitch 3", home:"The Dinosaurs", away:"Barnyard Fowls U9", competitionKey:"u910" },
  { id:"u910-r2-5", age:"U9/10", stage:"League", round:"Round 2", time:"9:00", pitch:"Pitch 4", home:"The Goats", away:"Repetech", competitionKey:"u910" },

  { id:"u78-r3-1", age:"U7/8", stage:"League", round:"Round 3", time:"9:20", pitch:"Pitch 1", home:"Peninsular Raiders", away:"Flaming Foxes", competitionKey:"u78" },
  { id:"u78-r3-2", age:"U7/8", stage:"League", round:"Round 3", time:"9:20", pitch:"Pitch 2", home:"Young Guns", away:"Southern U8/1", competitionKey:"u78" },
  { id:"u78-r3-3", age:"U7/8", stage:"League", round:"Round 3", time:"9:20", pitch:"Pitch 3", home:"GIRLS TBC", away:"Central Coast Strikers", competitionKey:"u78" },
  { id:"u910-r3-1", age:"U9/10", stage:"League", round:"Round 3", time:"9:20", pitch:"Pitch 4", home:"Chicken Nuggets", away:"Barnyard Fowls U9", competitionKey:"u910" },

  { id:"u910-r3-2", age:"U9/10", stage:"League", round:"Round 3", time:"9:40", pitch:"Pitch 1", home:"Sand Tigers", away:"The Gunners", competitionKey:"u910" },
  { id:"u910-r3-3", age:"U9/10", stage:"League", round:"Round 3", time:"9:40", pitch:"Pitch 2", home:"Raving Roosters U9", away:"The Goats", competitionKey:"u910" },
  { id:"u910-r3-4", age:"U9/10", stage:"League", round:"Round 3", time:"9:40", pitch:"Pitch 3", home:"Southern Lakes United U9", away:"The Dinosaurs", competitionKey:"u910" },
  { id:"u910-r3-5", age:"U9/10", stage:"League", round:"Round 3", time:"9:40", pitch:"Pitch 4", home:"TUFC U9 B1", away:"Repetech", competitionKey:"u910" },

  { id:"u78-r4-1", age:"U7/8", stage:"League", round:"Round 4", time:"10:00", pitch:"Pitch 1", home:"Peninsular Raiders", away:"Southern U8/1", competitionKey:"u78" },
  { id:"u78-r4-2", age:"U7/8", stage:"League", round:"Round 4", time:"10:00", pitch:"Pitch 2", home:"Flaming Foxes", away:"Central Coast Strikers", competitionKey:"u78" },
  { id:"u78-r4-3", age:"U7/8", stage:"League", round:"Round 4", time:"10:00", pitch:"Pitch 3", home:"Young Guns", away:"GIRLS TBC", competitionKey:"u78" },
  { id:"u910-r4-1", age:"U9/10", stage:"League", round:"Round 4", time:"10:00", pitch:"Pitch 4", home:"The Dinosaurs", away:"The Goats", competitionKey:"u910" },

  { id:"u910-r4-2", age:"U9/10", stage:"League", round:"Round 4", time:"10:20", pitch:"Pitch 1", home:"Sand Tigers", away:"Repetech", competitionKey:"u910" },
  { id:"u910-r4-3", age:"U9/10", stage:"League", round:"Round 4", time:"10:20", pitch:"Pitch 2", home:"Raving Roosters U9", away:"Southern Lakes United U9", competitionKey:"u910" },
  { id:"u910-r4-4", age:"U9/10", stage:"League", round:"Round 4", time:"10:20", pitch:"Pitch 3", home:"Barnyard Fowls U9", away:"The Gunners", competitionKey:"u910" },
  { id:"u910-r4-5", age:"U9/10", stage:"League", round:"Round 4", time:"10:20", pitch:"Pitch 4", home:"TUFC U9 B1", away:"Chicken Nuggets", competitionKey:"u910" },

  { id:"u78-r5-1", age:"U7/8", stage:"League", round:"Round 5", time:"10:40", pitch:"Pitch 1", home:"Peninsular Raiders", away:"Central Coast Strikers", competitionKey:"u78" },
  { id:"u78-r5-2", age:"U7/8", stage:"League", round:"Round 5", time:"10:40", pitch:"Pitch 2", home:"Southern U8/1", away:"GIRLS TBC", competitionKey:"u78" },
  { id:"u78-r5-3", age:"U7/8", stage:"League", round:"Round 5", time:"10:40", pitch:"Pitch 3", home:"Flaming Foxes", away:"Young Guns", competitionKey:"u78" },
  { id:"u910-top-semi-1", age:"U9/10", stage:"Semi Final", round:"Semi Final", time:"10:40", pitch:"Pitch 4", home:"1st U9/10", away:"4th U9/10", competitionKey:"u910TopSemi", dynamic:{ home:{ source:"standing", table:"u910", position:1 }, away:{ source:"standing", table:"u910", position:4 } }, label:"Semi Final 1" },

  { id:"u910-top-semi-2", age:"U9/10", stage:"Semi Final", round:"Semi Final", time:"11:00", pitch:"Pitch 1", home:"2nd U9/10", away:"3rd U9/10", competitionKey:"u910TopSemi", dynamic:{ home:{ source:"standing", table:"u910", position:2 }, away:{ source:"standing", table:"u910", position:3 } }, label:"Semi Final 2" },
  { id:"u910-place-56", age:"U9/10", stage:"Placing", round:"Placing", time:"11:00", pitch:"Pitch 2", home:"5th U9/10", away:"6th U9/10", competitionKey:"u910Placing", dynamic:{ home:{ source:"standing", table:"u910", position:5 }, away:{ source:"standing", table:"u910", position:6 } }, label:"5th/6th Playoff" },
  { id:"u910-place-78", age:"U9/10", stage:"Placing", round:"Placing", time:"11:00", pitch:"Pitch 3", home:"7th U9/10", away:"8th U9/10", competitionKey:"u910Placing", dynamic:{ home:{ source:"standing", table:"u910", position:7 }, away:{ source:"standing", table:"u910", position:8 } }, label:"7th/8th Playoff" },
  { id:"u910-place-910", age:"U9/10", stage:"Placing", round:"Placing", time:"11:00", pitch:"Pitch 4", home:"9th U9/10", away:"10th U9/10", competitionKey:"u910Placing", dynamic:{ home:{ source:"standing", table:"u910", position:9 }, away:{ source:"standing", table:"u910", position:10 } }, label:"9th/10th Playoff" },

  { id:"u910-final", age:"U9/10", stage:"Final", round:"Final", time:"11:40", pitch:"Pitch 1", home:"Winner Semi 1", away:"Winner Semi 2", competitionKey:"u910TopSemi", dynamic:{ home:{ source:"winner", fixtureId:"u910-top-semi-1" }, away:{ source:"winner", fixtureId:"u910-top-semi-2" } }, label:"Grand Final" },
  { id:"u78-final", age:"U7/8", stage:"Final", round:"Final", time:"11:40", pitch:"Pitch 2", home:"1st U7/8", away:"2nd U7/8", competitionKey:"u78Final", dynamic:{ home:{ source:"standing", table:"u78", position:1 }, away:{ source:"standing", table:"u78", position:2 } }, label:"Grand Final" },

  { id:"u1112-a-r1-1", age:"U11/12", stage:"Group A", round:"Round 1", time:"8:20", pitch:"Pitch 5", home:"Woy Woy U11A2", away:"Turf Pandas 2.0", competitionKey:"u1112A" },
  { id:"u1112-a-r1-2", age:"U11/12", stage:"Group A", round:"Round 1", time:"8:20", pitch:"Pitch 6", home:"Feisty Sharks U11", away:"Coastal United", competitionKey:"u1112A" },
  { id:"u1112-b-r1-1", age:"U11/12", stage:"Group B", round:"Round 1", time:"8:00", pitch:"Pitch 5", home:"Avoca FC U11", away:"TBC", competitionKey:"u1112B" },
  { id:"u1112-b-r1-2", age:"U11/12", stage:"Group B", round:"Round 1", time:"8:00", pitch:"Pitch 6", home:"Rebel Roar", away:"Terrigal 11A1", competitionKey:"u1112B" },

  { id:"u1112-a-r2-1", age:"U11/12", stage:"Group A", round:"Round 2", time:"9:00", pitch:"Pitch 5", home:"Woy Woy U11A2", away:"Coastal United", competitionKey:"u1112A" },
  { id:"u1112-a-r2-2", age:"U11/12", stage:"Group A", round:"Round 2", time:"9:00", pitch:"Pitch 6", home:"Turf Pandas 2.0", away:"Feisty Sharks U11", competitionKey:"u1112A" },
  { id:"u1112-b-r2-1", age:"U11/12", stage:"Group B", round:"Round 2", time:"8:40", pitch:"Pitch 5", home:"Avoca FC U11", away:"Terrigal 11A1", competitionKey:"u1112B" },
  { id:"u1112-b-r2-2", age:"U11/12", stage:"Group B", round:"Round 2", time:"8:40", pitch:"Pitch 6", home:"TBC", away:"Rebel Roar", competitionKey:"u1112B" },

  { id:"u1112-a-r3-1", age:"U11/12", stage:"Group A", round:"Round 3", time:"9:40", pitch:"Pitch 5", home:"Woy Woy U11A2", away:"Feisty Sharks U11", competitionKey:"u1112A" },
  { id:"u1112-a-r3-2", age:"U11/12", stage:"Group A", round:"Round 3", time:"9:40", pitch:"Pitch 6", home:"Coastal United", away:"Turf Pandas 2.0", competitionKey:"u1112A" },
  { id:"u1112-b-r3-1", age:"U11/12", stage:"Group B", round:"Round 3", time:"9:20", pitch:"Pitch 5", home:"Avoca FC U11", away:"Rebel Roar", competitionKey:"u1112B" },
  { id:"u1112-b-r3-2", age:"U11/12", stage:"Group B", round:"Round 3", time:"9:20", pitch:"Pitch 6", home:"Terrigal 11A1", away:"TBC", competitionKey:"u1112B" },

  { id:"u1112-cross-top-1", age:"U11/12", stage:"Crossovers", round:"Crossovers", time:"10:00", pitch:"Pitch 5", home:"1st Group A", away:"2nd Group B", competitionKey:"u1112KO", dynamic:{ home:{ source:"standing", table:"u1112A", position:1 }, away:{ source:"standing", table:"u1112B", position:2 } }, label:"Top Crossover 1" },
  { id:"u1112-cross-top-2", age:"U11/12", stage:"Crossovers", round:"Crossovers", time:"10:00", pitch:"Pitch 6", home:"2nd Group A", away:"1st Group B", competitionKey:"u1112KO", dynamic:{ home:{ source:"standing", table:"u1112A", position:2 }, away:{ source:"standing", table:"u1112B", position:1 } }, label:"Top Crossover 2" },
  { id:"u1112-cross-bot-1", age:"U11/12", stage:"Crossovers", round:"Crossovers", time:"10:20", pitch:"Pitch 5", home:"3rd Group A", away:"4th Group B", competitionKey:"u1112KO", dynamic:{ home:{ source:"standing", table:"u1112A", position:3 }, away:{ source:"standing", table:"u1112B", position:4 } }, label:"Bottom Crossover 1" },
  { id:"u1112-cross-bot-2", age:"U11/12", stage:"Crossovers", round:"Crossovers", time:"10:20", pitch:"Pitch 6", home:"4th Group A", away:"3rd Group B", competitionKey:"u1112KO", dynamic:{ home:{ source:"standing", table:"u1112A", position:4 }, away:{ source:"standing", table:"u1112B", position:3 } }, label:"Bottom Crossover 2" },

  { id:"u1112-final", age:"U11/12", stage:"Final", round:"Final", time:"10:40", pitch:"Pitch 5", home:"Winner Pitch 5", away:"Winner Pitch 6", competitionKey:"u1112KO", dynamic:{ home:{ source:"winner", fixtureId:"u1112-cross-top-1" }, away:{ source:"winner", fixtureId:"u1112-cross-top-2" } }, label:"Grand Final" },
  { id:"u1112-56", age:"U11/12", stage:"Placing", round:"Placing", time:"10:40", pitch:"Pitch 6", home:"Winner Bottom Crossover 1", away:"Winner Bottom Crossover 2", competitionKey:"u1112KO", dynamic:{ home:{ source:"winner", fixtureId:"u1112-cross-bot-1" }, away:{ source:"winner", fixtureId:"u1112-cross-bot-2" } }, label:"5th/6th Playoff" },
  { id:"u1112-34", age:"U11/12", stage:"Placing", round:"Placing", time:"11:00", pitch:"Pitch 5", home:"Loser Pitch 5", away:"Loser Pitch 6", competitionKey:"u1112KO", dynamic:{ home:{ source:"loser", fixtureId:"u1112-cross-top-1" }, away:{ source:"loser", fixtureId:"u1112-cross-top-2" } }, label:"3rd/4th Playoff" },
  { id:"u1112-78", age:"U11/12", stage:"Placing", round:"Placing", time:"11:00", pitch:"Pitch 6", home:"Loser Bottom Crossover 1", away:"Loser Bottom Crossover 2", competitionKey:"u1112KO", dynamic:{ home:{ source:"loser", fixtureId:"u1112-cross-bot-1" }, away:{ source:"loser", fixtureId:"u1112-cross-bot-2" } }, label:"7th/8th Playoff" },
];
