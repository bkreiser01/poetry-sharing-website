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
   "The Road Not Taken",
   "Two roads diverged in a yellow wood,\nAnd sorry I could not travel both\nAnd be one traveler, long I stood\nAnd looked down one as far as I could\nTo where it bent in the undergrowth;\n\nThen took the other, as just as fair,\nAnd having perhaps the better claim,\nBecause it was grassy and wanted wear;\nThough as for that the passing there\nHad worn them really about the same,\n\nAnd both that morning equally lay\nIn leaves no step had trodden black.\nOh, I kept the first for another day!\nYet knowing how way leads on to way,\nI doubted if I should ever come back.\n\nI shall be telling this with a sigh\nSomewhere ages and ages hence:\nTwo roads diverged in a wood, and I—\nI took the one less traveled by,\nAnd that has made all the difference.",
   bkrei_id.toString(),
   "https://www.poetryfoundation.org/poems/44272/the-road-not-taken",
   false
);

// Poem 2
let p2 = await poems.addPoem(
   new Date(),
   "If You Forget Me",
   "I want you to know\none thing.\n\nYou know how this is:\nif I look\nat the crystal moon, at the red branch\nof the slow autumn at my window,\nif I touch\nnear the fire\nthe impalpable ash\nor the wrinkled body of the log,\neverything carries me to you,\nas if everything that exists,\naromas, light, metals,\nwere little boats\nthat sail\ntoward those isles of yours that wait for me.\n\nWell, now,\nif little by little you stop loving me\nI shall stop loving you little by little.\n\nIf suddenly\nyou forget me\ndo not look for me,\nfor I shall already have forgotten you.\n\nIf you think it long and mad,\nthe wind of banners\nthat passes through my life,\nand you decide\nto leave me at the shore\nof the heart where I have roots,\nremember\nthat on that day,\nat that hour,\nI shall lift my arms\nand my roots will set off\nto seek another land.\n\nBut\nif each day,\neach hour,\nyou feel that you are destined for me\nwith implacable sweetness,\nif each day a flower\nclimbs up to your lips to seek me,\nah my love, ah my own,\nin me all that fire is repeated,\nin me nothing is extinguished or forgotten,\nmy love feeds on your love, beloved,\nand as long as you live it will be in your arms\nwithout leaving mine.",
   bkrei_id.toString(),
   "https://www.poetryfoundation.org/poems/43843/if-you-forget-me",
   false
);

// Continue adding more poems as needed
let p3 = await poems.addPoem(
   new Date(),
   "I Wandered Lonely as a Cloud",
   "I wandered lonely as a cloud\nThat floats on high o'er vales and hills,\nWhen all at once I saw a crowd,\nA host, of golden daffodils;\nFluttering and dancing in the breeze.",
   rshag_id.toString(),
   "https://www.poetryfoundation.org/poems/45521/i-wandered-lonely-as-a-cloud",
   false
);

let p4 = await poems.addPoem(
   new Date(),
   "Sonnet 18: Shall I compare thee to a summer's day?",
   "Shall I compare thee to a summer's day?\nThou art more lovely and more temperate:\nRough winds do shake the darling buds of May,\nAnd summer's lease hath all too short a date.",
   jvasa_id.toString(),
   "https://www.poetryfoundation.org/poems/45087/sonnet-18-shall-i-compare-thee-to-a-summers-day",
   false
);

let p5 = await poems.addPoem(
   new Date(),
   "The Road Not Taken",
   "Two roads diverged in a yellow wood,\nAnd sorry I could not travel both\nAnd be one traveler, long I stood\nAnd looked down one as far as I could\nTo where it bent in the undergrowth;\n\nThen took the other, as just as fair,\nAnd having perhaps the better claim,\nBecause it was grassy and wanted wear;\nThough as for that the passing there\nHad worn them really about the same,\n\nAnd both that morning equally lay\nIn leaves no step had trodden black.\nOh, I kept the first for another day!\nYet knowing how way leads on to way,\nI doubted if I should ever come back.\n\nI shall be telling this with a sigh\nSomewhere ages and ages hence:\nTwo roads diverged in a wood, and I—\nI took the one less traveled by,\nAnd that has made all the difference.",
   bkrei_id.toString(),
   "https://www.poetryfoundation.org/poems/44272/the-road-not-taken",
   false
);

let p6 = await poems.addPoem(
   new Date(),
   "Invictus",
   "Out of the night that covers me,\nBlack as the pit from pole to pole,\nI thank whatever gods may be\nFor my unconquerable soul.",
   rshag_id.toString(),
   "https://www.poetryfoundation.org/poems/51642/invictus",
   false
);

// Poem 7
let p7 = await poems.addPoem(
   new Date(),
   "Stopping by Woods on a Snowy Evening",
   "Whose woods these are I think I know.\nHis house is in the village though;\nHe will not see me stopping here\nTo watch his woods fill up with snow.",
   jvasa_id.toString(),
   "https://www.poetryfoundation.org/poems/42891/stopping-by-woods-on-a-snowy-evening",
   false
);

// Poem 8
let p8 = await poems.addPoem(
   new Date(),
   "Do Not Go Gentle into That Good Night",
   "Do not go gentle into that good night,\nOld age should burn and rave at close of day;\nRage, rage against the dying of the light.",
   ahuet_id.toString(),
   "https://www.poetryfoundation.org/poems/45418/do-not-go-gentle-into-that-good-night",
   false
);

// Poem 9
let p9 = await poems.addPoem(
   new Date(),
   "The Love Song of J. Alfred Prufrock",
   "Let us go then, you and I,\nWhen the evening is spread out against the sky\nLike a patient etherized upon a table;\nLet us go, through certain half-deserted streets,\nThe muttering retreats\nOf restless nights in one-night cheap hotels\nAnd sawdust restaurants with oyster-shells:",
   bkrei_id.toString(),
   "https://www.poetryfoundation.org/poems/44272/the-love-song-of-j-alfred-prufrock",
   false
);

// Poem 10
let p10 = await poems.addPoem(
   new Date(),
   "A Dream Within A Dream",
   "Take this kiss upon the brow!\nAnd, in parting from you now,\nThus much let me avow —\nYou are not wrong, who deem\nThat my days have been a dream;\nYet if hope has flown away\nIn a night, or in a day,\nIn a vision, or in none,\nIs it therefore the less gone?\nAll that we see or seem\nIs but a dream within a dream.",
   jsmith_id.toString(),
   "https://www.poetryfoundation.org/poems/52829/a-dream-within-a-dream",
   false
);

// Poem 11
let p11 = await poems.addPoem(
   new Date(),
   "The Raven",
   "Once upon a midnight dreary, while I pondered, weak and weary,\nOver many a quaint and curious volume of forgotten lore—\nWhile I nodded, nearly napping, suddenly there came a tapping,\nAs of some one gently rapping, rapping at my chamber door.",
   bkrei_id.toString(),
   "https://www.poetryfoundation.org/poems/48860/the-raven",
   false
);

// Poem 12
let p12 = await poems.addPoem(
   new Date(),
   "Annabel Lee",
   "It was many and many a year ago,\nIn a kingdom by the sea,\nThat a maiden there lived whom you may know\nBy the name of Annabel Lee.",
   rshag_id.toString(),
   "https://www.poetryfoundation.org/poems/44885/annabel-lee",
   false
);

// Poem 13
let p13 = await poems.addPoem(
   new Date(),
   "Ozymandias",
   "I met a traveler from an antique land\nWho said: Two vast and trunkless legs of stone\nStand in the desert. Near them on the sand,\nHalf sunk, a shattered visage lies, whose frown",
   jvasa_id.toString(),
   "https://www.poetryfoundation.org/poems/46565/ozymandias",
   false
);

// Poem 14
let p14 = await poems.addPoem(
   new Date(),
   "To Autumn",
   "Season of mists and mellow fruitfulness,\nClose-bosom friend of the maturing sun;\nConspiring with him how to load and bless\nWith fruit the vines that round the thatch-eves run;",
   ahuet_id.toString(),
   "https://www.poetryfoundation.org/poems/44484/to-autumn",
   false
);

// Poem 15
let p15 = await poems.addPoem(
   new Date(),
   "The Waste Land",
   "April is the cruellest month, breeding\nLilacs out of the dead land, mixing\nMemory and desire, stirring\nDull roots with spring rain.",
   rshag_id.toString(),
   "https://www.poetryfoundation.org/poems/47311/the-waste-land",
   false
);

// Poem 16
let p16 = await poems.addPoem(
   new Date(),
   "She Walks in Beauty",
   "She walks in beauty, like the night\nOf cloudless climes and starry skies;\nAnd all that’s best of dark and bright\nMeet in her aspect and her eyes;",
   bkrei_id.toString(),
   "https://www.poetryfoundation.org/poems/43844/she-walks-in-beauty",
   false
);

// Poem 17
let p17 = await poems.addPoem(
   new Date(),
   "The Love Song of J. Alfred Prufrock",
   "Let us go then, you and I,\nWhen the evening is spread out against the sky\nLike a patient etherized upon a table;\nLet us go, through certain half-deserted streets,\nThe muttering retreats\nOf restless nights in one-night cheap hotels\nAnd sawdust restaurants with oyster-shells:",
   rshag_id.toString(),
   "https://www.poetryfoundation.org/poems/44272/the-love-song-of-j-alfred-prufrock",
   false
);

// Poem 18
let p18 = await poems.addPoem(
   new Date(),
   "The Tyger",
   "Tyger Tyger, burning bright,\nIn the forests of the night;\nWhat immortal hand or eye,\nCould frame thy fearful symmetry?",
   bkrei_id.toString(),
   "https://www.poetryfoundation.org/poems/43687/the-tyger",
   false
);

// Poem 19
let p19 = await poems.addPoem(
   new Date(),
   "The Jabberwocky",
   "'Twas brillig, and the slithy toves\nDid gyre and gimble in the wabe;\nAll mimsy were the borogoves,\nAnd the mome raths outgrabe.",
   ahuet_id.toString(),
   "https://www.poetryfoundation.org/poems/42916/jabberwocky",
   false
);

// Poem 20
let p20 = await poems.addPoem(
   new Date(),
   "Ode to a Nightingale",
   "My heart aches, and a drowsy numbness pains\nMy sense, as though of hemlock I had drunk,\nOr emptied some dull opiate to the drains\nOne minute past, and Lethe-wards had sunk:",
   ahuet_id.toString(),
   "https://www.poetryfoundation.org/poems/44479/ode-to-a-nightingale",
   false
);

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
await users.updateProfilePicture(bkrei_id, "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2F2.bp.blogspot.com%2F-w-lGPKIuJ20%2FUm8z9_L9JRI%2FAAAAAAAAE58%2F3IgY4k-ZpF4%2Fs1600%2FFunny-Cat-Sunglasses.jpg&f=1&nofb=1&ipt=68b973f076c056f24055ddbcfada926989db6aadd011ce46a291998daa70c430&ipo=images")
await users.updateProfilePicture(ahuet_id, "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fyt3.ggpht.com%2Fa%2FAATXAJyWeXZD0Sbr56ZrFqfrd3p20CQqdfGjbd0efSQmHg%3Ds900-c-k-c0xffffffff-no-rj-mo&f=1&nofb=1&ipt=120fe0591892c8a1f1a888ae96846648f4337f141250d4325dc5fa7c14ec3b14&ipo=images")
await users.updateProfilePicture(rshag_id, "https://64.media.tumblr.com/2ae6f4a1e4dbbd0258fee30cde8905cb/341391a67f158fbe-9c/s1280x1920/a4cfcbda0d55c92e7ec577211f28277a266081af.jpg")
await users.updateProfilePicture(jvasa_id, "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Flh6.googleusercontent.com%2Fproxy%2FH9nXf6z6pbY0UCLlIzq_S-QUkhqhvsKrrvdC57kTnhncurWjJMuYhFcspQ0Et9I6ZfjTEsSzbNRMkcybIWMsxr899aKLeeCa1BGUTPc3Jcct_b9uk52E-u-H_JmvL2N5UyrirEkTGHsDtfYLL3LWT_v0%3Ds0-d&f=1&nofb=1&ipt=339646e9e95f3df0adb772569268caf3fd2fc872ff591908fa89eaa209be46fd&ipo=images")

console.log("Populate User Bios")
await users.updateBio(bkrei_id, "Hey folks! 👋 I'm all about that poetry life, currently grinding through CS 546 over at Stevens Institute of Tech. This is my last year of college, so you know it's crunch time! When I'm not knee-deep in code, I'm chilling with my favorite video games, and when the weather's nice, you can catch me outside. Poetry, gaming, and a bit of programming – that's my jam. Let's make the most of this last college lap! 🚀📚💻")
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