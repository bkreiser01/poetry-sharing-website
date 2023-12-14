import { dbConnection } from "./mongoConnection.js";

const db = await dbConnection();

const users_db = await db.collection("users");
const poems_db = await db.collection("poems");
const tags_db = await db.collection("tags");

users_db.deleteMany({});
poems_db.deleteMany({});
tags_db.deleteMany({});

import users from "../data/user.js";
import poems from "../data/poems.js";
import tags from "../data/tags.js";


console.log("Creating Users (this will take a while)")

let bkrei_id = await users.addUser(
    "bkreiser",
    "bkreiser@stevens.edu",
    "Password@01",
    "public"
)
console.log(` - bkreiser created with id ${bkrei_id}`)

let rshag_id = await users.addUser(
    "rshagawat",
    "rshagawat@stevens.edu",
    "Password@01",
    "public"
)
console.log(` - rshagawat created with id ${rshag_id}`)

let jvasa_id = await users.addUser(
    "jvasallo",
    "jvasallo@stevens.edu",
    "Password@01",
    "public"
)
console.log(` - jvasallo created with id ${jvasa_id}`)

let ahuet = await users.addUser(
    "ahuet",
    "ahuet@stevens.edu",
    "Password@01",
    "public"
)
console.log(` - ahuet created with id ${ahuet}`)

let jdoe = await users.addUser(
    "jdoe",
    "jdoe@gmail.com",
    "Password@01",
    "public"
)
console.log(` - jdoe created with id ${jdoe}`)

let jsmith = await users.addUser(
    "jsmith",
    "jsmith@yahoo.com",
    "Password@01",
    "private"
)
console.log(` - jsmith created with id ${jsmith}`)



console.log("\nCreating Poems")
let p1 = await poems.addPoem(
    new Date(),
    "Poem 1",
    "This is poem 1",
    bkrei_id.toString(),
    "",
    false
)
console.log(` - poem 1 created with id ${p1._id}`)

let p2 = await poems.addPoem(
    new Date(),
    "Poem 2",
    "This is poem 2",
    bkrei_id.toString(),
    "",
    false
)
console.log(` - poem 2 created with id ${p2._id}`)

let p3 = await poems.addPoem(
    new Date(),
    "Poem 3",
    "This is poem 3",
    bkrei_id.toString(),
    "",
    false
)
console.log(` - poem 3 created with id ${p3._id}`)

let p4 = await poems.addPoem(
    new Date(),
    "Poem 4",
    "This is poem 4",
    bkrei_id.toString(),
    "",
    false
)
console.log(` - poem 4 created with id ${p4._id}`)

let p5 = await poems.addPoem(
    new Date(),
    "Poem 5",
    "This is poem 5",
    bkrei_id.toString(),
    "",
    false
)
console.log(` - poem 5 created with id ${p5._id}`)

let p6 = await poems.addPoem(
    new Date(),
    "Poem 6",
    "This is poem 6",
    bkrei_id.toString(),
    "",
    false
)
console.log(` - poem 6 created with id ${p6._id}`)

let p7 = await poems.addPoem(
    new Date(),
    "Poem 7",
    "This is poem 7",
    bkrei_id.toString(),
    "",
    false
)
console.log(` - poem 7 created with id ${p7._id}`)

let p8 = await poems.addPoem(
    new Date(),
    "Poem 8",
    "This is poem 8",
    bkrei_id.toString(),
    "",
    false
)
console.log(` - poem 8 created with id ${p8._id}`)

let p9 = await poems.addPoem(
    new Date(),
    "Poem 9",
    "This is poem 9",
    bkrei_id.toString(),
    "",
    false
)
console.log(` - poem 9 created with id ${p9._id}`)

let p10 = await poems.addPoem(
    new Date(),
    "Poem 10",
    "This is poem 10",
    bkrei_id.toString(),
    "",
    false
)
console.log(` - poem 10 created with id ${p10._id}`)

let p11 = await poems.addPoem(
    new Date(),
    "Poem 11",
    "This is poem 11",
    bkrei_id.toString(),
    "",
    false
)
console.log(` - poem 11 created with id ${p11._id}`)

let p12 = await poems.addPoem(
    new Date(),
    "Poem 12",
    "This is poem 12",
    bkrei_id.toString(),
    "",
    false
)
console.log(` - poem 12 created with id ${p12._id}`)

let p13 = await poems.addPoem(
    new Date(),
    "Poem 13",
    "This is poem 13",
    bkrei_id.toString(),
    "",
    false
)
console.log(` - poem 13 created with id ${p13._id}`)

let p14 = await poems.addPoem(
    new Date(),
    "Poem 14",
    "This is poem 14",
    bkrei_id.toString(),
    "",
    false
)
console.log(` - poem 14 created with id ${p14._id}`)

let p15 = await poems.addPoem(
    new Date(),
    "Poem 15",
    "This is poem 15",
    bkrei_id.toString(),
    "",
    false
)
console.log(` - poem 15 created with id ${p15._id}`)

let p16 = await poems.addPoem(
    new Date(),
    "Poem 16",
    "This is poem 16",
    bkrei_id.toString(),
    "",
    false
)
console.log(` - poem 16 created with id ${p16._id}`)

let p17 = await poems.addPoem(
    new Date(),
    "Poem 17",
    "This is poem 17",
    bkrei_id.toString(),
    "",
    false
)
console.log(` - poem 17 created with id ${p17._id}`)

let p18 = await poems.addPoem(
    new Date(),
    "Poem 18",
    "This is poem 18",
    bkrei_id.toString(),
    "",
    false
)
console.log(` - poem 18 created with id ${p18._id}`)

let p19 = await poems.addPoem(
    new Date(),
    "Poem 19",
    "This is poem 19",
    bkrei_id.toString(),
    "",
    false
)
console.log(` - poem 19 created with id ${p19._id}`)

let p20 = await poems.addPoem(
    new Date(),
    "Poem 20",
    "This is poem 20",
    bkrei_id.toString(),
    "",
    false
)
console.log(` - poem 20 created with id ${p20._id}`)



console.log("\nCreating Tags/Tagging Poems")
let t1 = await tags.addTag("funny", p1._id.toString())
console.log(` - "${t1.tagString}" tag created with id ${t1._id}\n   tagged "${p1.title}" with tag "${t1.tagString}"`)

let t2 = await tags.addTag("scary", p2._id.toString())
console.log(` - "${t2.tagString}" tag created with id ${t2._id}\n   tagged "${p2.title}" with tag "${t2.tagString}"`)

let t3 = await tags.addTag("sad", p3._id.toString())
console.log(` - "${t3.tagString}" tag created with id ${t3._id}\n   tagged "${p3.title}" with tag "${t3.tagString}"`)

let t4 = await tags.addTag("to-live-by", p4._id.toString())
console.log(` - "${t4.tagString}" tag created with id ${t4._id}\n   tagged "${p4.title}" with tag "${t4.tagString}"`)


console.log("")