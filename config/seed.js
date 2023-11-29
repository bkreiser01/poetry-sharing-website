import * as connections from "./mongoConnection.js";
import { poems, users, tags } from "./mongoCollections.js";
import { ObjectId } from "mongodb";

const john = new ObjectId("000000000000000000000000");
const alice = new ObjectId("000000000000000000000001");
const bob = new ObjectId("000000000000000000000002");
const charlie = new ObjectId("000000000000000000000003");

const poemid0 = new ObjectId("aaaaaaaaaaaaaaaaaaaaaaa0");
const poemid1 = new ObjectId("aaaaaaaaaaaaaaaaaaaaaaa1");
const poemid2 = new ObjectId("aaaaaaaaaaaaaaaaaaaaaaa2");
const poemid3 = new ObjectId("aaaaaaaaaaaaaaaaaaaaaaa3");
const poemid4 = new ObjectId("aaaaaaaaaaaaaaaaaaaaaaa4");

const lol = new ObjectId("bbbbbbbbbbbbbbbbbbbbbbb0");
const nice = new ObjectId("bbbbbbbbbbbbbbbbbbbbbbb1");
const love = new ObjectId("bbbbbbbbbbbbbbbbbbbbbbb2");
const fire = new ObjectId("bbbbbbbbbbbbbbbbbbbbbbb3");

export const seedUserData = [
  {
    _id: john,
    username: "John Doe",
    email: "jdoe@gmail.com",
    hashedPassword: "$2a$08$XdvNkfdNIL8F8xsuIUeSbNOFgK0M0iV5HOskfVn7.PWncShU.O",
    timeAccountMade:
      "Mon Nov 13 2023 14:47:57 GMT-0500 (Eastern Standard Time)",
    private: false,
    bio: "I like to write poems!",
    poemIds: [poemid0, poemid4],
    taggedPoems: [poemid4],
    tagsUsed: [lol],
    favorites: [poemid1],
    recentlyViewedPoemIds: [],
    followers: [alice, bob, charlie],
    following: [alice],
  },

  {
    _id: alice,
    username: "Alice Smith",
    email: "asmith@gmail.com",
    hashedPassword: "$2a$08$XdvNkfdNIL8F8xsuIUeSbNOFgK0M0iV5HOskfVn7.PWncShU.O",
    timeAccountMade:
      "Mon Nov 13 2023 14:47:57 GMT-0500 (Eastern Standard Time)",
    private: false,
    bio: "I am Alice",
    poemIds: [poemid1, poemid2],
    taggedPoems: [
      {
        _id: new ObjectId("ddddddddddddddddddddddd0"),
        poemId: poemid0,
        tagIds: [lol, love],
      },
    ],
    tagsUsed: [lol, love],
    favorites: [poemid0],
    recentlyViewedPoemIds: [],
    followers: [john, bob, charlie],
    following: [john],
  },

  {
    _id: bob,
    username: "Bob Smith",
    email: "bsmith@gmail.com",
    hashedPassword: "$2a$08$XdvNkfdNIL8F8xsuIUeSbNOFgK0M0iV5HOskfVn7.PWncShU.O",
    timeAccountMade:
      "Mon Nov 13 2023 14:47:57 GMT-0500 (Eastern Standard Time)",
    private: false,
    bio: "I am Bob",
    poemIds: [],
    taggedPoems: [
      {
        _id: new ObjectId("ddddddddddddddddddddddd1"),
        poemId: poemid1,
        tagIds: [nice],
      },
      {
        _id: new ObjectId("ddddddddddddddddddddddd4"),
        poemId: poemid3,
        tagIds: [fire],
      },
      {
        _id: new ObjectId("ddddddddddddddddddddddd5"),
        poemId: poemid3,
        tagIds: [lol],
      },
    ],
    tagsUsed: [nice, fire, lol],
    favorites: [poemid0, poemid1, poemid3],
    recentlyViewedPoemIds: [],
    followers: [charlie],
    following: [john, alice, charlie],
  },

  {
    _id: charlie,
    username: "Charlie Smith",
    email: "csmith@gmail.com",
    hashedPassword: "$2a$08$XdvNkfdNIL8F8xsuIUeSbNOFgK0M0iV5HOskfVn7.PWncShU.O",
    timeAccountMade:
      "Mon Nov 13 2023 14:47:57 GMT-0500 (Eastern Standard Time)",
    private: true,
    bio: "I am Charlie",
    poemIds: [poemid3],
    taggedPoems: [
      {
        _id: new ObjectId("ddddddddddddddddddddddd2"),
        poemId: poemid1,
        tagIds: [nice],
      },
      {
        _id: new ObjectId("ddddddddddddddddddddddd3"),
        poemId: poemid3,
        tagIds: [fire],
      },
    ],
    tagsUsed: [nice, fire],
    favorites: [poemid0, poemid3],
    recentlyViewedPoemIds: [],
    followers: [bob],
    following: [john, alice, bob],
  },
];

export const seedPoemData = [
  {
    _id: poemid0,
    timeSubmitted: "Mon Nov 13 2023 14:44:59 GMT-0500 (Eastern Standard Time)",
    title: "Stopping by Woods on a Snowy Evening",
    body: "Whose woods these are I think I know.\
    His house is in the village though;\
    He will not see me stopping here\
    To watch his woods fill up with snow.",
    userId: john,
    link: "https://www.youtube.com/watch?v=1sWcq2-ZA5o",
    submittedTags: [
      {
        _id: new ObjectId("ccccccccccccccccccccccc0"),
        tagId: lol,
        tagCount: 1, // alice
      },
      {
        _id: new ObjectId("ccccccccccccccccccccccc1"),
        tagId: love,
        tagCount: 1, // alice
      },
    ],
    totalTagCount: 2,
    favoriteCount: 3, // alice, bob, charlie
    comments: [
      {
        _id: new ObjectId("eeeeeeeeeeeeeeeeeeeeee10"),
        tagId: lol,
        userId: alice,
        timeCommented:
          "Mon Nov 13 2023 14:58:40 GMT-0500 (Eastern Standard Time)",
        commentString: "Wow this poem is laugh out loud funny!",
        repliesTo: null,
      },
      {
        _id: new ObjectId("eeeeeeeeeeeeeeeeeeeeee11"),
        tagId: lol,
        userId: john,
        timeCommented:
          "Mon Nov 13 2023 15:01:28 GMT-0500 (Eastern Standard Time)",
        commentString: "Thanks, it is funny lol",
        repliesTo: new ObjectId("eeeeeeeeeeeeeeeeeeeeee10"),
      },
      {
        _id: new ObjectId("eeeeeeeeeeeeeeeeeeeeee12"),
        tagId: lol,
        userId: alice,
        timeCommented:
          "Mon Nov 13 2023 15:10:11 GMT-0500 (Eastern Standard Time)",
        commentString: "Yeah that's why I commented lol!!!!!",
        repliesTo: new ObjectId("eeeeeeeeeeeeeeeeeeeeee11"),
      },
      {
        _id: new ObjectId("eeeeeeeeeeeeeeeeeeeeee20"),
        tagId: love,
        userId: bob,
        timeCommented:
          "Mon Nov 14 2023 00:05:49 GMT-0500 (Eastern Standard Time)",
        commentString: "Love this",
        repliesTo: null,
      },
    ],
    private: false,
  },

  {
    _id: poemid1,
    timeSubmitted: "Mon Nov 14 2023 14:44:59 GMT-0500 (Eastern Standard Time)",
    title: "Test poem",
    body: "This is a test",
    userId: alice,
    link: "https://www.youtube.com/watch?v=1sWcq2-ZA5o",
    submittedTags: [
      {
        _id: new ObjectId("ccccccccccccccccccccccc2"),
        tagId: nice,
        tagCount: 2, // bob, charlie
      },
    ],
    totalTagCount: 2,
    favoriteCount: 2, // john, bob
    comments: [
      {
        _id: new ObjectId("eeeeeeeeeeeeeeeeeeeeee30"),
        tagId: nice,
        userId: bob,
        timeCommented:
          "Mon Nov 14 2023 15:05:49 GMT-0500 (Eastern Standard Time)",
        commentString: "It's a nice first!",
        repliesTo: null,
      },
      {
        _id: new ObjectId("eeeeeeeeeeeeeeeeeeeeee31"),
        tagId: nice,
        userId: alice,
        timeCommented:
          "Mon Nov 14 2023 15:11:12 GMT-0500 (Eastern Standard Time)",
        commentString: "thx bob",
        repliesTo: new ObjectId("eeeeeeeeeeeeeeeeeeeeee30"),
      },
    ],
    private: false,
  },

  {
    _id: poemid2,
    timeSubmitted: "Mon Nov 15 2023 14:44:59 GMT-0500 (Eastern Standard Time)",
    title: "Another One",
    body: "Lorem ipsum dolor",
    userId: alice,
    link: "",
    submittedTags: [],
    totalTagCount: 0,
    favoriteCount: 0,
    comments: [],
    private: true,
  },

  {
    _id: poemid3,
    timeSubmitted: "Mon Nov 16 2023 14:44:59 GMT-0500 (Eastern Standard Time)",
    title: "My first poem",
    body: "Had to write at least one",
    userId: charlie,
    link: "",
    submittedTags: [
      {
        _id: new ObjectId("ccccccccccccccccccccccc3"),
        tagId: fire,
        tagCount: 2, // charlie, bob
      },
      {
        _id: new ObjectId("ccccccccccccccccccccccc4"),
        tagId: lol,
        tagCount: 1, // bob
      },
    ],
    totalTagCount: 3,
    favoriteCount: 2, // bob, charlie
    comments: [
      {
        _id: new ObjectId("eeeeeeeeeeeeeeeeeeeeee40"),
        tagId: fire,
        userId: bob,
        timeCommented:
          "Mon Nov 14 2023 15:05:49 GMT-0500 (Eastern Standard Time)",
        commentString: "Let's go charlie :fire:",
        repliesTo: null,
      },
      {
        _id: new ObjectId("eeeeeeeeeeeeeeeeeeeeee41"),
        tagId: fire,
        userId: charlie,
        timeCommented:
          "Mon Nov 14 2023 15:11:12 GMT-0500 (Eastern Standard Time)",
        commentString: "The first of many!",
        repliesTo: new ObjectId("eeeeeeeeeeeeeeeeeeeeee40"),
      },
    ],
    private: false,
  },
  {
    _id: poemid4,
    timeSubmitted: "Mon Nov 17 2023 14:44:59 GMT-0500 (Eastern Standard Time)",
    title: "No debate in the comments",
    body: "This only has top-level comments",
    userId: alice,
    link: "",
    submittedTags: [
      {
        _id: new ObjectId("ccccccccccccccccccccccc5"),
        tagId: lol,
        tagCount: 1, // John
      },
    ],
    totalTagCount: 1,
    favoriteCount: 0,
    comments: [
      {
        _id: new ObjectId("eeeeeeeeeeeeeeeeeeeeee50"),
        tagId: lol,
        userId: bob,
        timeCommented:
          "Mon Nov 18 2023 15:05:49 GMT-0500 (Eastern Standard Time)",
        commentString: "Top-level 1",
        repliesTo: null,
      },
      {
        _id: new ObjectId("eeeeeeeeeeeeeeeeeeeeee60"),
        tagId: lol,
        userId: charlie,
        timeCommented:
          "Mon Nov 18 2023 15:11:12 GMT-0500 (Eastern Standard Time)",
        commentString: "Top-level 2",
        repliesTo: null,
      },
    ],
  },
];

export const seedTagData = [
  {
    _id: lol,
    tagString: "LOL",
    taggedPoemsId: [poemid0, poemid3, poemid4],
  },
  {
    _id: nice,
    tagString: "nice",
    taggedPoemsId: [poemid1],
  },
  {
    _id: love,
    tagString: "love",
    taggedPoemsId: [poemid0],
  },
  {
    _id: fire,
    tagString: "fire",
    taggedPoemsId: [poemid3],
  },
];

export const seedDb = async () => {
  const db = await connections.dbConnection();
  await db.dropDatabase();

  const poemCollection = await poems();
  const userCollection = await users();
  const tagCollection = await tags();

  await poemCollection.insertMany(seedPoemData);
  await userCollection.insertMany(seedUserData);
  await tagCollection.insertMany(seedTagData);
};

// await seedDb();
// await connections.closeConnection();
