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


console.log("Creating Users")

let bkrei_id = await users.addUser(
    "bkreiser",
    "bkreiser@stevens.edu",
    "Password@01",
    "public"
)

let rshag_id = await users.addUser(
    "rshagawat",
    "rshagawat@stevens.edu",
    "Password@01",
    "public"
)

let jvasa_id = await users.addUser(
    "jvasallo",
    "jvasallo@stevens.edu",
    "Password@01",
    "public"
)

let ahuet_id = await users.addUser(
    "ahuet",
    "ahuet@stevens.edu",
    "Password@01",
    "public"
)

let jdoe_id = await users.addUser(
    "jdoe",
    "jdoe@gmail.com",
    "Password@01",
    "public"
)

let jsmith_id = await users.addUser(
    "jsmith",
    "jsmith@yahoo.com",
    "Password@01",
    "private"
)


console.log("Creating Poems")
let p1 = await poems.addPoem(
    new Date(),
    "A Blessing",
    "Just off the highway to Rochester, Minnesota,\nTwilight bounds softly forth on the grass.\nAnd the eyes of those two Indian ponies\nDarken with kindness.\nThey have come gladly out of the willows\nTo welcome my friend and me.\nWe step over the barbed wire into the pasture\nWhere they have been grazing all day, alone.\nThey ripple tensely, they can hardly contain their happiness\nThat we have come.\nThey bow shyly as wet swans. They love each other.\nThere is no loneliness like theirs.\nAt home once more,\nThey begin munching the young tufts of spring in the darkness.\nI would like to hold the slenderer one in my arms,\nFor she has walked over to me\nAnd nuzzled my left hand.\nShe is black and white,\nHer mane falls wild on her forehead,\nAnd the light breeze moves me to caress her long ear\nThat is delicate as the skin over a girl’s wrist.\nSuddenly I realize\nThat if I stepped out of my body I would break\nInto blossom.",
    bkrei_id.toString(),
    "https://www.poetryfoundation.org/poems/46481/a-blessing",
    false
)

let p2 = await poems.addPoem(
    new Date(),
    "Poem 2",
    "This is poem 2",
    bkrei_id.toString(),
    "",
    false
)

let p3 = await poems.addPoem(
    new Date(),
    "Poem 3",
    "This is poem 3",
    bkrei_id.toString(),
    "",
    false
)

let p4 = await poems.addPoem(
    new Date(),
    "Poem 4",
    "This is poem 4",
    bkrei_id.toString(),
    "",
    false
)

let p5 = await poems.addPoem(
    new Date(),
    "Poem 5",
    "This is poem 5",
    bkrei_id.toString(),
    "",
    false
)

let p6 = await poems.addPoem(
    new Date(),
    "Poem 6",
    "This is poem 6",
    rshag_id.toString(),
    "",
    false
)

let p7 = await poems.addPoem(
    new Date(),
    "Poem 7",
    "This is poem 7",
    rshag_id.toString(),
    "",
    false
)

let p8 = await poems.addPoem(
    new Date(),
    "Poem 8",
    "This is poem 8",
    rshag_id.toString(),
    "",
    false
)

let p9 = await poems.addPoem(
    new Date(),
    "Poem 9",
    "This is poem 9",
    rshag_id.toString(),
    "",
    false
)

let p10 = await poems.addPoem(
    new Date(),
    "Poem 10",
    "This is poem 10",
    rshag_id.toString(),
    "",
    false
)

let p11 = await poems.addPoem(
    new Date(),
    "Poem 11",
    "This is poem 11",
    ahuet_id.toString(),
    "",
    false
)

let p12 = await poems.addPoem(
    new Date(),
    "Poem 12",
    "This is poem 12",
    ahuet_id.toString(),
    "",
    false
)

let p13 = await poems.addPoem(
    new Date(),
    "Poem 13",
    "This is poem 13",
    ahuet_id.toString(),
    "",
    false
)

let p14 = await poems.addPoem(
    new Date(),
    "Poem 14",
    "This is poem 14",
    ahuet_id.toString(),
    "",
    false
)

let p15 = await poems.addPoem(
    new Date(),
    "Poem 15",
    "This is poem 15",
    ahuet_id.toString(),
    "",
    false
)

let p16 = await poems.addPoem(
    new Date(),
    "Poem 16",
    "This is poem 16",
    jvasa_id.toString(),
    "",
    false
)

let p17 = await poems.addPoem(
    new Date(),
    "Poem 17",
    "This is poem 17",
    jvasa_id.toString(),
    "",
    false
)

let p18 = await poems.addPoem(
    new Date(),
    "Poem 18",
    "This is poem 18",
    jvasa_id.toString(),
    "",
    false
)

let p19 = await poems.addPoem(
    new Date(),
    "Poem 19",
    "This is poem 19",
    jvasa_id.toString(),
    "",
    false
)

let p20 = await poems.addPoem(
    new Date(),
    "Poem 20",
    "This is poem 20",
    jvasa_id.toString(),
    "",
    false
)

console.log("Creating Tags")
let t1 = await tags.createNewTag("scary")
let t2 = await tags.createNewTag("happy")
let t3 = await tags.createNewTag("sad")
let t4 = await tags.createNewTag("funny")
let t5 = await tags.createNewTag("cheerful")

console.log("Populate User Bios")
await users.updateBio(bkrei_id, "My name is Brandon! I like to write poems and read poems. I also like to play video games and watch movies. I am a senior at Stevens Institute of Technology.")
await users.updateBio(rshag_id, "My name is Roger! I like to write poems and read poems. I also like to play video games and watch movies. I am a senior at Stevens Institute of Technology.")
await users.updateBio(jvasa_id, "My name is Joe! I like to write poems and read poems. I also like to play video games and watch movies. I am a senior at Stevens Institute of Technology.")
await users.updateBio(ahuet_id, "My name is Adrien! I like to write poems and read poems. I also like to play video games and watch movies. I am a senior at Stevens Institute of Technology.")

console.log("Populate user tagged poems")

console.log("Populate user favorites")
await users.addFavorite(bkrei_id, p1._id.toString())
await users.addFavorite(bkrei_id, p2._id.toString())
await users.addFavorite(rshag_id, p3._id.toString())
await users.addFavorite(rshag_id, p4._id.toString())
await users.addFavorite(jvasa_id, p5._id.toString())
await users.addFavorite(jvasa_id, p6._id.toString())
await users.addFavorite(ahuet_id, p7._id.toString())

console.log("Populate user recently viewed")
await users.addRecentlyViewedPoem(bkrei_id, p8._id.toString())
await users.addRecentlyViewedPoem(bkrei_id, p9._id.toString())
await users.addRecentlyViewedPoem(rshag_id, p10._id.toString())
await users.addRecentlyViewedPoem(rshag_id, p11._id.toString())
await users.addRecentlyViewedPoem(jvasa_id, p12._id.toString())
await users.addRecentlyViewedPoem(jvasa_id, p13._id.toString())
await users.addRecentlyViewedPoem(ahuet_id, p14._id.toString())
await users.addRecentlyViewedPoem(ahuet_id, p15._id.toString())

console.log("Populate user following")
await users.addFollowing(bkrei_id, rshag_id)
await users.addFollowing(bkrei_id, jvasa_id)
await users.addFollowing(rshag_id, jsmith_id)
await users.addFollowing(rshag_id, bkrei_id)
await users.addFollowing(ahuet_id, jvasa_id)
await users.addFollowing(ahuet_id, jdoe_id)
await users.addFollowing(jvasa_id, jsmith_id)
await users.addFollowing(jvasa_id, ahuet_id)
await users.addFollowing(jdoe_id, jvasa_id)
await users.addFollowing(jdoe_id, jsmith_id)
await users.addFollowing(jsmith_id, ahuet_id)
await users.addFollowing(jsmith_id, jvasa_id)

console.log("Done!")