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

console.log("Creating Users");

let bkrei_id = await users.addUser(
   "bkreiser",
   "bkreiser@stevens.edu",
   "Password@01",
   "public"
);

let rshag_id = await users.addUser(
   "rshagawat",
   "rshagawat@stevens.edu",
   "Password@01",
   "public"
);

let jvasa_id = await users.addUser(
   "jvasallo",
   "jvasallo@stevens.edu",
   "Password@01",
   "public"
);

let ahuet_id = await users.addUser(
   "ahuet",
   "ahuet@stevens.edu",
   "Password@01",
   "public"
);

let jdoe_id = await users.addUser(
   "jdoe",
   "jdoe@gmail.com",
   "Password@01",
   "public"
);

let jsmith_id = await users.addUser(
   "jsmith",
   "jsmith@yahoo.com",
   "Password@01",
   "private"
);

let phill_id = await users.addUser(
   "pHill",
   "pHill@gmail.com",
   "Password@01",
   "public"
);

let pshelly_id = await users.addUser(
   "pShelly",
   "pShelly@gmail.com",
   "#Bysshe1792",
   "public"
);

let epoe_id = await users.addUser(
   "ePoe",
   "ePoe@gmail.com",
   "#Allan1809",
   "private"
);

let owilde_id = await users.addUser(
   "oWilde",
   "oWilde@gmail.com",
   "#Fingal-Wills1882",
   "public"
);

let edickinson_id = await users.addUser(
   "eDickinson",
   "eDickinson@gmail.com",
   "#Elizabeth1830",
   "public"
);

let mangelou_id = await users.addUser(
   "mAngelou",
   "mAngelou@gmail.com",
   "#Marguerite1928",
   "public"
);

console.log("Creating Poems");
let p1 = await poems.addPoem(
   new Date(),
   "A Blessing",
   "Just off the highway to Rochester, Minnesota,\nTwilight bounds softly forth on the grass.\nAnd the eyes of those two Indian ponies\nDarken with kindness.\nThey have come gladly out of the willows\nTo welcome my friend and me.\nWe step over the barbed wire into the pasture\nWhere they have been grazing all day, alone.\nThey ripple tensely, they can hardly contain their happiness\nThat we have come.\nThey bow shyly as wet swans. They love each other.\nThere is no loneliness like theirs.\nAt home once more,\nThey begin munching the young tufts of spring in the darkness.\nI would like to hold the slenderer one in my arms,\nFor she has walked over to me\nAnd nuzzled my left hand.\nShe is black and white,\nHer mane falls wild on her forehead,\nAnd the light breeze moves me to caress her long ear\nThat is delicate as the skin over a girl’s wrist.\nSuddenly I realize\nThat if I stepped out of my body I would break\nInto blossom.",
   bkrei_id.toString(),
   "https://www.poetryfoundation.org/poems/46481/a-blessing",
   false
);

let p2 = await poems.addPoem(
   new Date(),
   "Poem 2",
   "This is poem 2",
   bkrei_id.toString(),
   "",
   false
);

let p3 = await poems.addPoem(
   new Date(),
   "Poem 3",
   "This is poem 3",
   bkrei_id.toString(),
   "",
   false
);

let p4 = await poems.addPoem(
   new Date(),
   "Poem 4",
   "This is poem 4",
   bkrei_id.toString(),
   "",
   false
);

let p5 = await poems.addPoem(
   new Date(),
   "Poem 5",
   "This is poem 5",
   bkrei_id.toString(),
   "",
   false
);

let p6 = await poems.addPoem(
   new Date(),
   "Poem 6",
   "This is poem 6",
   rshag_id.toString(),
   "",
   false
);

let p7 = await poems.addPoem(
   new Date(),
   "Poem 7",
   "This is poem 7",
   rshag_id.toString(),
   "",
   false
);

let p8 = await poems.addPoem(
   new Date(),
   "Poem 8",
   "This is poem 8",
   rshag_id.toString(),
   "",
   false
);

let p9 = await poems.addPoem(
   new Date(),
   "Poem 9",
   "This is poem 9",
   rshag_id.toString(),
   "",
   false
);

let p10 = await poems.addPoem(
   new Date(),
   "Poem 10",
   "This is poem 10",
   rshag_id.toString(),
   "",
   false
);

let p11 = await poems.addPoem(
   new Date(),
   "Poem 11",
   "This is poem 11",
   ahuet_id.toString(),
   "",
   false
);

let p12 = await poems.addPoem(
   new Date(),
   "Poem 12",
   "This is poem 12",
   ahuet_id.toString(),
   "",
   false
);

let p13 = await poems.addPoem(
   new Date(),
   "Poem 13",
   "This is poem 13",
   ahuet_id.toString(),
   "",
   false
);

let p14 = await poems.addPoem(
   new Date(),
   "Poem 14",
   "This is poem 14",
   ahuet_id.toString(),
   "",
   false
);

let p15 = await poems.addPoem(
   new Date(),
   "Poem 15",
   "This is poem 15",
   ahuet_id.toString(),
   "",
   false
);

let p16 = await poems.addPoem(
   new Date(),
   "Poem 16",
   "This is poem 16",
   jvasa_id.toString(),
   "",
   false
);

let p17 = await poems.addPoem(
   new Date(),
   "Poem 17",
   "This is poem 17",
   jvasa_id.toString(),
   "",
   false
);

let p18 = await poems.addPoem(
   new Date(),
   "Poem 18",
   "This is poem 18",
   jvasa_id.toString(),
   "",
   false
);

let p19 = await poems.addPoem(
   new Date(),
   "Poem 19",
   "This is poem 19",
   jvasa_id.toString(),
   "",
   false
);

let p20 = await poems.addPoem(
    new Date(),
    "Poem 20",
    "This is poem 20",
    jvasa_id.toString(),
    "",
    false
)

console.log("Creating Tags")
let t1 = await tags.createNewTag("nice")
t1 = (await tags.getTagById(t1)).tagString
let t2 = await tags.createNewTag("happy")
t2 = (await tags.getTagById(t2)).tagString
let t3 = await tags.createNewTag("sad")
t3 = (await tags.getTagById(t3)).tagString
let t4 = await tags.createNewTag("funny")
t4 = (await tags.getTagById(t4)).tagString
let t5 = await tags.createNewTag("scary")
t5 = (await tags.getTagById(t5)).tagString

console.log("Populate Profile Pictures")
await users.updateProfilePicture(bkrei_id, "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia.istockphoto.com%2Fvectors%2Fwhite-cat-wearing-sunglasses-eyeglasses-shining-lenses-cute-cartoon-vector-id1048770966%3Fk%3D6%26m%3D1048770966%26s%3D170667a%26w%3D0%26h%3D_0Cf7aD3ebVMRhywRlIxcgSeoCpyRtiWfemmkJ6Z32Q%3D&f=1&nofb=1&ipt=c06ad6dfdbc0deb1725e3146263ec25209f156892ec16561a40f8cc86a3c31be&ipo=images")

console.log("Populate User Bios")
await users.updateBio(bkrei_id, "My name is Brandon! I like to write poems and read poems. I also like to play video games and watch movies. I am a senior at Stevens Institute of Technology.")
await users.updateBio(rshag_id, "My name is Roger! I like to write poems and read poems. I also like to play video games and watch movies. I am a senior at Stevens Institute of Technology.")
await users.updateBio(jvasa_id, "My name is Joe! I like to write poems and read poems. I also like to play video games and watch movies. I am a senior at Stevens Institute of Technology.")
await users.updateBio(ahuet_id, "My name is Adrien! I like to write poems and read poems. I also like to play video games and watch movies. I am a senior at Stevens Institute of Technology.")

console.log("Populate user tagged poems")
await users.addTagToPoem(bkrei_id, t2, p6._id.toString())
await users.addTagToPoem(bkrei_id, t2, p7._id.toString())
await users.addTagToPoem(bkrei_id, t2, p8._id.toString())

await users.addTagToPoem(bkrei_id, t1, p1._id.toString())
await users.addTagToPoem(bkrei_id, t1, p2._id.toString())
await users.addTagToPoem(bkrei_id, t1, p3._id.toString())
await users.addTagToPoem(bkrei_id, t1, p4._id.toString())
await users.addTagToPoem(bkrei_id, t1, p5._id.toString())


await users.addTagToPoem(rshag_id, t2, p6._id.toString())
await users.addTagToPoem(rshag_id, t2, p7._id.toString())
await users.addTagToPoem(rshag_id, t2, p8._id.toString())
await users.addTagToPoem(rshag_id, t2, p9._id.toString())
await users.addTagToPoem(ahuet_id, t3, p10._id.toString())
await users.addTagToPoem(ahuet_id, t3, p11._id.toString())
await users.addTagToPoem(ahuet_id, t3, p12._id.toString())
await users.addTagToPoem(jvasa_id, t4, p13._id.toString())
await users.addTagToPoem(jvasa_id, t4, p14._id.toString())

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