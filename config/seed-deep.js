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

let ahuet_id = await users.addUser(
    "ahuet",
    "ahuet@stevens.edu",
    "Password@01",
    "public"
)
console.log(` - ahuet created with id ${ahuet_id}`)

let jdoe_id = await users.addUser(
    "jdoe",
    "jdoe@gmail.com",
    "Password@01",
    "public"
)
console.log(` - jdoe created with id ${jdoe_id}`)

let jsmith_id = await users.addUser(
    "jsmith",
    "jsmith@yahoo.com",
    "Password@01",
    "private"
)
console.log(` - jsmith created with id ${jsmith_id}`)



console.log("\nCreating Poems")
let p1 = await poems.addPoem(
    new Date(),
    "A Blessing",
    "Just off the highway to Rochester, Minnesota,\nTwilight bounds softly forth on the grass.\nAnd the eyes of those two Indian ponies\nDarken with kindness.\nThey have come gladly out of the willows\nTo welcome my friend and me.\nWe step over the barbed wire into the pasture\nWhere they have been grazing all day, alone.\nThey ripple tensely, they can hardly contain their happiness\nThat we have come.\nThey bow shyly as wet swans. They love each other.\nThere is no loneliness like theirs.\nAt home once more,\nThey begin munching the young tufts of spring in the darkness.\nI would like to hold the slenderer one in my arms,\nFor she has walked over to me\nAnd nuzzled my left hand.\nShe is black and white,\nHer mane falls wild on her forehead,\nAnd the light breeze moves me to caress her long ear\nThat is delicate as the skin over a girl’s wrist.\nSuddenly I realize\nThat if I stepped out of my body I would break\nInto blossom.",
    bkrei_id.toString(),
    "https://www.poetryfoundation.org/poems/46481/a-blessing",
    false
)
console.log(` - ${p1.title} created with id ${p1._id}`)

let p2 = await poems.addPoem(
    new Date(),
    "Poem 2",
    "This is poem 2",
    bkrei_id.toString(),
    "",
    false
)
console.log(` - ${p2.title} created with id ${p2._id}`)

let p3 = await poems.addPoem(
    new Date(),
    "Poem 3",
    "This is poem 3",
    bkrei_id.toString(),
    "",
    false
)
console.log(` - ${p3.title} created with id ${p3._id}`)

let p4 = await poems.addPoem(
    new Date(),
    "Poem 4",
    "This is poem 4",
    bkrei_id.toString(),
    "",
    false
)
console.log(` - ${p4.title} created with id ${p4._id}`)

let p5 = await poems.addPoem(
    new Date(),
    "Poem 5",
    "This is poem 5",
    bkrei_id.toString(),
    "",
    false
)
console.log(` - ${p5.title} created with id ${p5._id}`)

let p6 = await poems.addPoem(
    new Date(),
    "Poem 6",
    "This is poem 6",
    rshag_id.toString(),
    "",
    false
)
console.log(` - ${p6.title} created with id ${p6._id}`)

let p7 = await poems.addPoem(
    new Date(),
    "Poem 7",
    "This is poem 7",
    rshag_id.toString(),
    "",
    false
)
console.log(` - ${p7.title} created with id ${p7._id}`)

let p8 = await poems.addPoem(
    new Date(),
    "Poem 8",
    "This is poem 8",
    rshag_id.toString(),
    "",
    false
)
console.log(` - ${p8.title} created with id ${p8._id}`)

let p9 = await poems.addPoem(
    new Date(),
    "Poem 9",
    "This is poem 9",
    rshag_id.toString(),
    "",
    false
)
console.log(` - ${p9.title} created with id ${p9._id}`)

let p10 = await poems.addPoem(
    new Date(),
    "Poem 10",
    "This is poem 10",
    rshag_id.toString(),
    "",
    false
)
console.log(` - ${p10.title} created with id ${p10._id}`)

let p11 = await poems.addPoem(
    new Date(),
    "Poem 11",
    "This is poem 11",
    ahuet_id.toString(),
    "",
    false
)
console.log(` - ${p11.title} created with id ${p11._id}`)

let p12 = await poems.addPoem(
    new Date(),
    "Poem 12",
    "This is poem 12",
    ahuet_id.toString(),
    "",
    false
)
console.log(` - ${p12.title} created with id ${p12._id}`)

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
console.log(` - ${p14.title} created with id ${p14._id}`)

let p15 = await poems.addPoem(
    new Date(),
    "Poem 15",
    "This is poem 15",
    ahuet_id.toString(),
    "",
    false
)
console.log(` - ${p15.title} created with id ${p15._id}`)

let p16 = await poems.addPoem(
    new Date(),
    "Poem 16",
    "This is poem 16",
    jvasa_id.toString(),
    "",
    false
)
console.log(` - ${p16.title} created with id ${p16._id}`)

let p17 = await poems.addPoem(
    new Date(),
    "Poem 17",
    "This is poem 17",
    jvasa_id.toString(),
    "",
    false
)
console.log(` - ${p17.title} created with id ${p17._id}`)

let p18 = await poems.addPoem(
    new Date(),
    "Poem 18",
    "This is poem 18",
    jvasa_id.toString(),
    "",
    false
)
console.log(` - ${p18.title} created with id ${p18._id}`)

let p19 = await poems.addPoem(
    new Date(),
    "Poem 19",
    "This is poem 19",
    jvasa_id.toString(),
    "",
    false
)
console.log(` - ${p19.title} created with id ${p19._id}`)

let p20 = await poems.addPoem(
    new Date(),
    "Poem 20",
    "This is poem 20",
    jvasa_id.toString(),
    "",
    false
)
console.log(` - ${p20.title} created with id ${p20._id}`)



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

console.log("Populating Users with data")

// Populate bio's
await users.updateBio(bkrei_id, "My name is Brandon! I like to write poems and read poems. I also like to play video games and watch movies. I am a senior at Stevens Institute of Technology.")
console.log(` - bkreiser bio updated`)
await users.updateBio(rshag_id, "My name is Roger! I like to write poems and read poems. I also like to play video games and watch movies. I am a senior at Stevens Institute of Technology.")
console.log(` - rshagawat bio updated`)
await users.updateBio(jvasa_id, "My name is Joe! I like to write poems and read poems. I also like to play video games and watch movies. I am a senior at Stevens Institute of Technology.")
console.log(` - jvasallo bio updated`)
await users.updateBio(ahuet_id, "My name is Adrien! I like to write poems and read poems. I also like to play video games and watch movies. I am a senior at Stevens Institute of Technology.")
console.log(` - ahuet bio updated`)

// Populate tagged poems

// Populate favorites
await users.addFavorite(bkrei_id, p1._id.toString())
console.log(` - bkreiser favorited ${p1.title}`)
await users.addFavorite(bkrei_id, p2._id.toString())
console.log(` - bkreiser favorited ${p2.title}`)
await users.addFavorite(rshag_id, p3._id.toString())
console.log(` - rshagawat favorited ${p3.title}`)
await users.addFavorite(rshag_id, p4._id.toString())
console.log(` - rshagawat favorited ${p4.title}`)
await users.addFavorite(jvasa_id, p5._id.toString())
console.log(` - jvasallo favorited ${p5.title}`)
await users.addFavorite(jvasa_id, p6._id.toString())
console.log(` - jvasallo favorited ${p6.title}`)
await users.addFavorite(ahuet_id, p7._id.toString())
console.log(` - ahuet favorited ${p7.title}`)

// Populate recently viewed
await users.addRecentlyViewedPoem(bkrei_id, p8._id.toString())
console.log(` - bkreiser recently viewed ${p8.title}`)
await users.addRecentlyViewedPoem(bkrei_id, p9._id.toString())
console.log(` - bkreiser recently viewed ${p9.title}`)
await users.addRecentlyViewedPoem(rshag_id, p10._id.toString())
console.log(` - rshagawat recently viewed ${p10.title}`)
await users.addRecentlyViewedPoem(rshag_id, p11._id.toString())
console.log(` - rshagawat recently viewed ${p11.title}`)
await users.addRecentlyViewedPoem(jvasa_id, p12._id.toString())
console.log(` - jvasallo recently viewed ${p12.title}`)
await users.addRecentlyViewedPoem(jvasa_id, p13._id.toString())
console.log(` - jvasallo recently viewed ${p13.title}`)
await users.addRecentlyViewedPoem(ahuet_id, p14._id.toString())
console.log(` - ahuet recently viewed ${p14.title}`)
await users.addRecentlyViewedPoem(ahuet_id, p15._id.toString())
console.log(` - ahuet recently viewed ${p15.title}`)

// Populate following )
await users.addFollowing(bkrei_id, rshag_id)
console.log(` - bkreiser is now following rshagawat`)
await users.addFollowing(bkrei_id, jvasa_id)
console.log(` - bkreiser is now following jvasallo`)
await users.addFollowing(rshag_id, jsmith_id)
console.log(` - rshagawat is now following jsmith`)
await users.addFollowing(rshag_id, bkrei_id)
console.log(` - rshagawat is now following ahuet`)
await users.addFollowing(ahuet_id, jvasa_id)
console.log(` - ahuet is now following jvasallo`)
await users.addFollowing(ahuet_id, jdoe_id)
console.log(` - ahuet is now following jdoe`)
await users.addFollowing(jvasa_id, jsmith_id)
console.log(` - jvasallo is now following jsmith`)
await users.addFollowing(jvasa_id, ahuet_id)
console.log(` - jvasallo is now following ahuet`)
await users.addFollowing(jdoe_id, jvasa_id)
console.log(` - jdoe is now following jvasallo`)
await users.addFollowing(jdoe_id, jsmith_id)
console.log(` - jdoe is now following jsmith`)
await users.addFollowing(jsmith_id, ahuet_id)
console.log(` - jsmith is now following ahuet`)
await users.addFollowing(jsmith_id, jvasa_id)
console.log(` - jsmith is now following jvasallo`)

