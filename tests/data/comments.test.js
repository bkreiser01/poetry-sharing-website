import { dbConnection, closeConnection } from "../../config/mongoConnection.js";
import { poems, users, tags } from "../../config/mongoCollections.js";
import { seedDb, seedPoemData } from "../../config/seed.js";
import comments from "../../data/comments.js";

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
  await _db.dropDatabase();
  await closeConnection();
});

describe("getCommentById", () => {
  test("no_args", async () => {
    await expect(comments.getCommentById()).rejects.toThrow();
  });

  test("not_a_string", async () => {
    await expect(comments.getCommentById(1)).rejects.toThrow();
  });

  test("empty_string", async () => {
    await expect(comments.getCommentById("")).rejects.toThrow();
  });

  test("string_just_spaces", async () => {
    await expect(comments.getCommentById("     ")).rejects.toThrow();
  });

  test("commentId_invalid", async () => {
    await expect(comments.getCommentById("test")).rejects.toThrow();
  });

  test("commentId_no_comment_found", async () => {
    await expect(
      comments.getCommentById("fefefefefefefefefefefefe")
    ).rejects.toThrow();
  });

  test("commentId_found", async () => {
    await expect(
      comments.getCommentById(seedPoemData[0].comments[0]._id.toString())
    ).resolves.toEqual(seedPoemData[0].comments[0]);
  });

  test("comment_is_reply", async () => {
    await expect(
      comments.getCommentById(seedPoemData[3].comments[1]._id.toString())
    ).resolves.toEqual(seedPoemData[3].comments[1]);
  });

  test("commentId_found_trim_check", async () => {
    await expect(
      comments.getCommentById(
        "                   " +
          seedPoemData[0].comments[0]._id.toString() +
          "  "
      )
    ).resolves.toEqual(seedPoemData[0].comments[0]);
  });
});

describe("getAllCommentsFromPoem", () => {
  test("no_args", async () => {
    await expect(comments.getAllCommentsFromPoem()).rejects.toThrow();
  });

  test("not_a_string", async () => {
    await expect(comments.getAllCommentsFromPoem(1)).rejects.toThrow();
  });

  test("empty_string", async () => {
    await expect(comments.getAllCommentsFromPoem("")).rejects.toThrow();
  });

  test("string_just_spaces", async () => {
    await expect(comments.getAllCommentsFromPoem("     ")).rejects.toThrow();
  });

  test("poemId_invalid", async () => {
    await expect(comments.getAllCommentsFromPoem("test")).rejects.toThrow();
  });

  test("poemId_no_poem_found", async () => {
    await expect(
      comments.getAllCommentsFromPoem("fefefefefefefefefefefefe")
    ).rejects.toThrow();
  });

  test("poem_has_comments", async () => {
    await expect(
      comments.getAllCommentsFromPoem(seedPoemData[0]._id.toString())
    ).resolves.toEqual(seedPoemData[0].comments);
  });

  test("poem_has_no_comment", async () => {
    await expect(
      comments.getAllCommentsFromPoem(seedPoemData[2]._id.toString())
    ).resolves.toEqual([]);
  });
});

describe("getTopLevelCommentsFromPoem", () => {
  test("no_args", async () => {
    await expect(comments.getTopLevelCommentsFromPoem()).rejects.toThrow();
  });

  test("not_a_string", async () => {
    await expect(comments.getTopLevelCommentsFromPoem(1)).rejects.toThrow();
  });

  test("empty_string", async () => {
    await expect(comments.getTopLevelCommentsFromPoem("")).rejects.toThrow();
  });

  test("string_just_spaces", async () => {
    await expect(
      comments.getTopLevelCommentsFromPoem("     ")
    ).rejects.toThrow();
  });

  test("poemId_invalid", async () => {
    await expect(
      comments.getTopLevelCommentsFromPoem("test")
    ).rejects.toThrow();
  });

  test("poemId_no_poem_found", async () => {
    await expect(
      comments.getTopLevelCommentsFromPoem("fefefefefefefefefefefefe")
    ).rejects.toThrow();
  });

  test("poem_has_no_comment", async () => {
    await expect(
      comments.getTopLevelCommentsFromPoem(seedPoemData[2]._id.toString())
    ).resolves.toEqual([]);
  });
  test("poem_has_only_top_level_comments", async () => {
    await expect(
      comments.getTopLevelCommentsFromPoem(seedPoemData[4]._id.toString())
    ).resolves.toEqual(seedPoemData[4].comments);
  });

  test("poem_also_has_replies_to_comments", async () => {
    const poem0TopLevelComments = seedPoemData[0].comments.filter(
      (comment) => comment.repliesTo == null
    );
    await expect(
      comments.getTopLevelCommentsFromPoem(seedPoemData[0]._id.toString())
    ).resolves.toEqual(poem0TopLevelComments);
  });
});
