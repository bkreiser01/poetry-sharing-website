import { dbConnection, closeConnection } from "../../config/mongoConnection.js";
import { poems, users, tags } from "../../config/mongoCollections.js";
import {
   seedDb,
   seedPoemData,
   seedTagData,
   seedUserData,
} from "../../config/seed.js";
import poemsData from "../../data/poems.js";

let _db = undefined;
let _poemCollection = undefined;
let _userCollection = undefined;
let _tagCollection = undefined;

beforeAll(async () => {
   _db = await dbConnection();
   _poemCollection = await poems();
   _userCollection = await users();
   _tagCollection = await tags();

   await seedDb();
});

afterAll(async () => {
   await closeConnection();
});

describe("getPoemById", () => {
   test("no_args", async () => {
      await expect(poemsData.getPoemById()).rejects.toThrow();
   });

   test("not_a_string", async () => {
      await expect(poemsData.getPoemById(1)).rejects.toThrow();
   });

   test("empty_string", async () => {
      await expect(poemsData.getPoemById("")).rejects.toThrow();
   });

   test("string_just_spaces", async () => {
      await expect(poemsData.getPoemById("     ")).rejects.toThrow();
   });

   test("poemId_invalid", async () => {
      await expect(poemsData.getPoemById("test")).rejects.toThrow();
   });

   test("poemId_no_poem_found", async () => {
      await expect(
         poemsData.getPoemById("fefefefefefefefefefefefe")
      ).rejects.toThrow();
   });

   test("poemId_found", async () => {
      await expect(
         poemsData.getPoemById(seedPoemData[0]._id.toString())
      ).resolves.toEqual(seedPoemData[0]);
   });

   test("poemtId_found_trim_check", async () => {
      await expect(
         poemsData.getPoemById(`   ${seedPoemData[0]._id.toString()}   `)
      ).resolves.toEqual(seedPoemData[0]);
   });
});

describe("addPoem", () => {
   test("no_args", async () => {
      await expect(poemsData.addPoem()).rejects.toThrow();
   });
});

/*
describe("addSubmittedTag", () => {
   test("no_args", async () => {
      await expect(poemsData.addSubmittedTag()).rejects.toThrow();
   });

   test("poemId_not_a_string", async () => {
      await expect(
         poemsData.addSubmittedTag(1, "bbbbbbbbbbbbbbbbbbbbbbb0")
      ).rejects.toThrow();
   });

   test("poemId_empty_string", async () => {
      await expect(
         poemsData.addSubmittedTag("", "bbbbbbbbbbbbbbbbbbbbbbb0")
      ).rejects.toThrow();
   });

   test("poemId_string_just_spaces", async () => {
      await expect(
         poemsData.addSubmittedTag("     ", "bbbbbbbbbbbbbbbbbbbbbbb0")
      ).rejects.toThrow();
   });

   test("poemId_invalid", async () => {
      await expect(
         poemsData.addSubmittedTag("test", "bbbbbbbbbbbbbbbbbbbbbbb0")
      ).rejects.toThrow();
   });

   test("tagId_not_a_string", async () => {
      await expect(
         poemsData.addSubmittedTag(seedPoemData[0]._id.toString(), 1)
      ).rejects.toThrow();
   });

   test("tagId_empty_string", async () => {
      await expect(
         poemsData.addSubmittedTag(seedPoemData[0]._id.toString(), "")
      ).rejects.toThrow();
   });

   test("tagId_string_just_spaces", async () => {
      await expect(
         poemsData.addSubmittedTag(seedPoemData[0]._id.toString(), "    ")
      ).rejects.toThrow();
   });

   test("tagId_invalid", async () => {
      await expect(
         poemsData.addSubmittedTag(seedPoemData[0]._id.toString(), "test")
      ).rejects.toThrow();
   });

   test("valid_addSubmittedTag_with_tag_present", async () => {
      const previous = await _poemCollection.findOne({
         _id: seedPoemData[0]._id,
      });
      let result = undefined;
      try {
         result = await poemsData.addSubmittedTag(
            "aaaaaaaaaaaaaaaaaaaaaaa0",
            "bbbbbbbbbbbbbbbbbbbbbbb0"
         );
      } catch (e) {
         throw new Error(`Test failed with error: ${e.toString()}`);
      }

      const current = await _poemCollection.findOne({
         _id: seedPoemData[0]._id,
      });

      // Check that function returned something
      expect(result).toBeTruthy();
      // That something must the be updated poem
      expect(result).toEqual(current);
      // submittedTag sizes are unchanged
      expect(previous.submittedTags.length).toEqual(
         current.submittedTags.length
      );
      // That poem has submittedTag.tagCount increased by one
      const findFunc = (submittedTag) => {
         submittedTag.tagId.toString() === "bbbbbbbbbbbbbbbbbbbbbbb0";
      };

      // const found = current.submittedTags.find(findFunc);
      // expect(found).toBeTruthy();

      expect(current.submittedTags.find(findFunc)).toEqual(
         previous.submittedTags.find(findFunc)
      );
   });

   test("valid_addSubmittedTag_with_tag_absent", async () => {
      const previous = await _poemCollection.findOne({
         _id: seedPoemData[0]._id,
      });
      let result = undefined;
      try {
         result = await poemsData.addSubmittedTag(
            seedPoemData[0]._id.toString(),
            seedTagData[1]._id.toString()
         );
      } catch (e) {
         throw new Error(`Test failed with error: ${e.toString()}`);
      }

      const current = await _poemCollection.findOne({
         _id: seedPoemData[0]._id,
      });

      // Check that function returned something
      expect(result).toBeTruthy();
      // That something must the be updated poem
      expect(result).toEqual(current);
      // submittedTag size increased by one
      expect(current.submittedTags.length).toEqual(
         previous.submittedTags.length + 1
      );
      // That poem has submittedTag.tagCount increased by one
      const findFunc = (submittedTag) => {
         submittedTag.tagId === "bbbbbbbbbbbbbbbbbbbbbbb1";
      };
      // submittedTag not present in previous
      expect(!previous.submittedTags.find(findFunc)).toBeTruthy();
      // SubmittedTag present in current
      expect(current.submittedTags.find(findFunc)).toBeTruthy();
      expect(current.submittedTags.find(findFunc).tagCount).toEqual(1);
   });
});
*/

describe("searchByTitle", () => {
   test("no_args", async () => {
      await expect(poemsData.searchByTitle()).rejects.toThrow();
   });

   test("not_a_string", async () => {
      await expect(poemsData.searchByTitle(1)).rejects.toThrow();
   });

   test("empty_string", async () => {
      await expect(poemsData.searchByTitle("")).rejects.toThrow();
   });

   test("string_just_spaces", async () => {
      await expect(poemsData.searchByTitle("     ")).rejects.toThrow();
   });

   test("string_just_spaces", async () => {
      await expect(poemsData.searchByTitle("     ")).rejects.toThrow();
   });

   test("returns_1", async () => {
      const received = await poemsData.searchByTitle(
         "Stopping by Woods on a Snowy Evening"
      );
      console.log(received);
      expect(received).toEqual(seedPoemData[0]);
   });
});
