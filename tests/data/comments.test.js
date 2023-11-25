import { dbConnection, closeConnection } from "../../config/mongoConnection.js";
import { poems, users, tags } from "../../config/mongoCollections.js";
import {
  seedDb,
  seedPoemData,
  seedTagData,
  seedUserData,
} from "../../config/seed.js";
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
  // await _db.dropDatabase();
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

describe("addCommentToPoem", () => {
  test("no_args", async () => {
    await expect(comments.addCommentToPoem()).rejects.toThrow();
  });

  test("userId_not_a_string", async () => {
    await expect(
      comments.addCommentToPoem(
        1,
        seedTagData[0]._id.toString(),
        "Mon Nov 14 2023 00:05:49 GMT-0500 (Eastern Standard Time)",
        "test",
        seedPoemData[0]._id.toString()
      )
    ).rejects.toThrow();
  });

  test("userId_empty", async () => {
    await expect(
      comments.addCommentToPoem(
        "",
        seedTagData[0]._id.toString(),
        "Mon Nov 14 2023 00:05:49 GMT-0500 (Eastern Standard Time)",
        "test",
        seedPoemData[0]._id.toString()
      )
    ).rejects.toThrow();
  });

  test("userId_just_spaces", async () => {
    await expect(
      comments.addCommentToPoem(
        "        ",
        seedTagData[0]._id.toString(),
        "Mon Nov 14 2023 00:05:49 GMT-0500 (Eastern Standard Time)",
        "test",
        seedPoemData[0]._id.toString()
      )
    ).rejects.toThrow();
  });

  test("userId_not_a_valid_ObjectId", async () => {
    await expect(
      comments.addCommentToPoem(
        "not_valid",
        seedTagData[0]._id.toString(),
        "Mon Nov 14 2023 00:05:49 GMT-0500 (Eastern Standard Time)",
        "test",
        seedPoemData[0]._id.toString()
      )
    ).rejects.toThrow();
  });
  test("tagId_not_a_string", async () => {
    await expect(
      comments.addCommentToPoem(
        seedUserData[0]._id.toString(),
        1,
        "Mon Nov 14 2023 00:05:49 GMT-0500 (Eastern Standard Time)",
        "test",
        seedPoemData[0]._id.toString()
      )
    ).rejects.toThrow();
  });

  test("tagId_empty", async () => {
    await expect(
      comments.addCommentToPoem(
        seedUserData[0]._id.toString(),
        "",
        "Mon Nov 14 2023 00:05:49 GMT-0500 (Eastern Standard Time)",
        "test",
        seedPoemData[0]._id.toString()
      )
    ).rejects.toThrow();
  });

  test("tagId_just_spaces", async () => {
    await expect(
      comments.addCommentToPoem(
        seedUserData[0]._id.toString(),
        "        ",
        "Mon Nov 14 2023 00:05:49 GMT-0500 (Eastern Standard Time)",
        "test",
        seedPoemData[0]._id.toString()
      )
    ).rejects.toThrow();
  });

  test("tagId_not_a_valid_ObjectId", async () => {
    await expect(
      comments.addCommentToPoem(
        seedUserData[0]._id.toString(),
        "not_valid",
        "Mon Nov 14 2023 00:05:49 GMT-0500 (Eastern Standard Time)",
        "test",
        seedPoemData[0]._id.toString()
      )
    ).rejects.toThrow();
  });
  test("poemId_not_a_string", async () => {
    await expect(
      comments.addCommentToPoem(
        seedUserData[0]._id.toString(),
        seedTagData[0]._id.toString(),
        "Mon Nov 14 2023 00:05:49 GMT-0500 (Eastern Standard Time)",
        "test",
        1
      )
    ).rejects.toThrow();
  });

  test("poemId_empty", async () => {
    await expect(
      comments.addCommentToPoem(
        seedUserData[0]._id.toString(),
        seedTagData[0]._id.toString(),
        "Mon Nov 14 2023 00:05:49 GMT-0500 (Eastern Standard Time)",
        "test",
        ""
      )
    ).rejects.toThrow();
  });

  test("poemId_just_spaces", async () => {
    await expect(
      comments.addCommentToPoem(
        seedUserData[0]._id.toString(),
        seedTagData[0]._id.toString(),
        "Mon Nov 14 2023 00:05:49 GMT-0500 (Eastern Standard Time)",
        "test",
        "         "
      )
    ).rejects.toThrow();
  });

  test("poemId_not_a_valid_ObjectId", async () => {
    await expect(
      comments.addCommentToPoem(
        seedUserData[0]._id.toString(),
        seedTagData[0]._id.toString(),
        "Mon Nov 14 2023 00:05:49 GMT-0500 (Eastern Standard Time)",
        "test",
        "not_valid"
      )
    ).rejects.toThrow();
  });

  test("commentString_not_a_string", async () => {
    await expect(
      comments.addCommentToPoem(
        seedUserData[0]._id.toString(),
        seedTagData[0]._id.toString(),
        "Mon Nov 14 2023 00:05:49 GMT-0500 (Eastern Standard Time)",
        1,
        seedPoemData[0]._id.toString()
      )
    ).rejects.toThrow();
  });

  test("commentString_empty", async () => {
    await expect(
      comments.addCommentToPoem(
        seedUserData[0]._id.toString(),
        seedTagData[0]._id.toString(),
        "Mon Nov 14 2023 00:05:49 GMT-0500 (Eastern Standard Time)",
        "",
        seedPoemData[0]._id.toString()
      )
    ).rejects.toThrow();
  });

  test("commentString_just_spaces", async () => {
    await expect(
      comments.addCommentToPoem(
        seedUserData[0]._id.toString(),
        seedTagData[0]._id.toString(),
        "Mon Nov 14 2023 00:05:49 GMT-0500 (Eastern Standard Time)",
        "         ",
        seedPoemData[0]._id.toString()
      )
    ).rejects.toThrow();
  });

  test("timeCommented_not_a_string", async () => {
    await expect(
      comments.addCommentToPoem(
        seedUserData[0]._id.toString(),
        seedTagData[0]._id.toString(),
        1,
        "test",
        seedPoemData[0]._id.toString()
      )
    ).rejects.toThrow();
  });

  test("timeCommented_empty", async () => {
    await expect(
      comments.addCommentToPoem(
        seedUserData[0]._id.toString(),
        seedTagData[0]._id.toString(),
        "",
        "test",
        seedPoemData[0]._id.toString()
      )
    ).rejects.toThrow();
  });

  test("timeCommented_just_spaces", async () => {
    await expect(
      comments.addCommentToPoem(
        seedUserData[0]._id.toString(),
        seedTagData[0]._id.toString(),
        "       ",
        "test",
        seedPoemData[0]._id.toString()
      )
    ).rejects.toThrow();
  });

  // TODO discuss date format and add/modify related tests

  test("no_user_with_userId", async () => {
    await expect(
      comments.addCommentToPoem(
        "fefefefefefefefefefefefe",
        seedTagData[0]._id.toString(),
        "Mon Nov 14 2023 00:05:49 GMT-0500 (Eastern Standard Time)",
        "test",
        seedPoemData[0]._id.toString()
      )
    ).rejects.toThrow();
  });

  test("no_poem_with_poemId", async () => {
    await expect(
      comments.addCommentToPoem(
        seedUserData[0]._id.toString(),
        seedTagData[0]._id.toString(),
        "Mon Nov 14 2023 00:05:49 GMT-0500 (Eastern Standard Time)",
        "test",
        "fefefefefefefefefefefefe"
      )
    ).rejects.toThrow();
  });

  // The two following test are virtually the same
  test("no_tag_with_tagId", async () => {
    await expect(
      comments.addCommentToPoem(
        seedUserData[0]._id.toString(),
        "fefefefefefefefefefefefe",
        "Mon Nov 14 2023 00:05:49 GMT-0500 (Eastern Standard Time)",
        "test",
        seedPoemData[0]._id.toString()
      )
    ).rejects.toThrow();
  });

  test("poem_does_not_include_tag", async () => {
    await expect(
      comments.addCommentToPoem(
        seedUserData[0]._id.toString(),
        seedTagData[0]._id.toString(),
        "Mon Nov 14 2023 00:05:49 GMT-0500 (Eastern Standard Time)",
        "test",
        seedPoemData[1]._id.toString()
      )
    ).rejects.toThrow();
  });

  test("valid_add_comment", async () => {
    const previous = await _poemCollection.findOne({
      _id: seedPoemData[0]._id,
    });
    let result = undefined;
    try {
      result = await comments.addCommentToPoem(
        seedUserData[0]._id.toString(),
        seedTagData[0]._id.toString(),
        "Mon Nov 14 2023 00:05:49 GMT-0500 (Eastern Standard Time)",
        "This is a test comment",
        seedPoemData[0]._id.toString()
      );
    } catch (e) {
      throw new Error(`Test failed with error: ${e.toString()}`);
    }
    const current = await _poemCollection.findOne({ _id: seedPoemData[0]._id });

    // Check that function returned something
    expect(result).toBeTruthy();
    // That something must the be updated poem
    expect(result).toEqual(current);
    // That poem has one more comment than before
    expect(current.comments.length).toEqual(previous.comments.length + 1);

    // Find the specific comment we inserted
    const found = current.comments.find(
      (comment) =>
        comment.tagId.toString() === seedTagData[0]._id.toString() &&
        comment.userId.toString() === seedUserData[0]._id.toString() &&
        comment.timeCommented ===
          "Mon Nov 14 2023 00:05:49 GMT-0500 (Eastern Standard Time)" &&
        comment.commentString === "This is a test comment" &&
        comment.repliesTo === null
    );
    // We found it
    expect(found).toBeTruthy();
  });
});

describe("addReplyToComment", () => {
  test("no_args", async () => {
    await expect(comments.addCommentToPoem()).rejects.toThrow();
  });

  test("userId_not_a_string", async () => {
    await expect(
      comments.addReplyToComment(
        1,
        seedPoemData[0].comments[0]._id.toString(),
        "Mon Nov 14 2023 00:05:49 GMT-0500 (Eastern Standard Time)",
        "test",
        seedPoemData[0]._id.toString()
      )
    ).rejects.toThrow();
  });

  test("userId_empty", async () => {
    await expect(
      comments.addReplyToComment(
        "",
        seedPoemData[0].comments[0]._id.toString(),
        "Mon Nov 14 2023 00:05:49 GMT-0500 (Eastern Standard Time)",
        "test",
        seedPoemData[0]._id.toString()
      )
    ).rejects.toThrow();
  });

  test("userId_just_spaces", async () => {
    await expect(
      comments.addReplyToComment(
        "        ",
        seedPoemData[0].comments[0]._id.toString(),
        "Mon Nov 14 2023 00:05:49 GMT-0500 (Eastern Standard Time)",
        "test",
        seedPoemData[0]._id.toString()
      )
    ).rejects.toThrow();
  });

  test("userId_not_a_valid_ObjectId", async () => {
    await expect(
      comments.addReplyToComment(
        "not_valid",
        seedPoemData[0].comments[0]._id.toString(),
        "Mon Nov 14 2023 00:05:49 GMT-0500 (Eastern Standard Time)",
        "test",
        seedPoemData[0]._id.toString()
      )
    ).rejects.toThrow();
  });
  test("commentId_not_a_string", async () => {
    await expect(
      comments.addReplyToComment(
        seedUserData[0]._id.toString(),
        1,
        "Mon Nov 14 2023 00:05:49 GMT-0500 (Eastern Standard Time)",
        "test",
        seedPoemData[0]._id.toString()
      )
    ).rejects.toThrow();
  });

  test("commentId_empty", async () => {
    await expect(
      comments.addReplyToComment(
        seedUserData[0]._id.toString(),
        "",
        "Mon Nov 14 2023 00:05:49 GMT-0500 (Eastern Standard Time)",
        "test",
        seedPoemData[0]._id.toString()
      )
    ).rejects.toThrow();
  });

  test("commentId_just_spaces", async () => {
    await expect(
      comments.addReplyToComment(
        seedUserData[0]._id.toString(),
        "        ",
        "Mon Nov 14 2023 00:05:49 GMT-0500 (Eastern Standard Time)",
        "test",
        seedPoemData[0]._id.toString()
      )
    ).rejects.toThrow();
  });

  test("commentId_not_a_valid_ObjectId", async () => {
    await expect(
      comments.addReplyToComment(
        seedUserData[0]._id.toString(),
        "not_valid",
        "Mon Nov 14 2023 00:05:49 GMT-0500 (Eastern Standard Time)",
        "test",
        seedPoemData[0]._id.toString()
      )
    ).rejects.toThrow();
  });
  test("poemId_not_a_string", async () => {
    await expect(
      comments.addReplyToComment(
        seedUserData[0]._id.toString(),
        seedPoemData[0].comments[0]._id.toString(),
        "Mon Nov 14 2023 00:05:49 GMT-0500 (Eastern Standard Time)",
        "test",
        1
      )
    ).rejects.toThrow();
  });

  test("poemId_empty", async () => {
    await expect(
      comments.addReplyToComment(
        seedUserData[0]._id.toString(),
        seedPoemData[0].comments[0]._id.toString(),
        "Mon Nov 14 2023 00:05:49 GMT-0500 (Eastern Standard Time)",
        "test",
        ""
      )
    ).rejects.toThrow();
  });

  test("poemId_just_spaces", async () => {
    await expect(
      comments.addReplyToComment(
        seedUserData[0]._id.toString(),
        seedPoemData[0].comments[0]._id.toString(),
        "Mon Nov 14 2023 00:05:49 GMT-0500 (Eastern Standard Time)",
        "test",
        "         "
      )
    ).rejects.toThrow();
  });

  test("poemId_not_a_valid_ObjectId", async () => {
    await expect(
      comments.addReplyToComment(
        seedUserData[0]._id.toString(),
        seedPoemData[0].comments[0]._id.toString(),
        "Mon Nov 14 2023 00:05:49 GMT-0500 (Eastern Standard Time)",
        "test",
        "not_valid"
      )
    ).rejects.toThrow();
  });

  test("commentString_not_a_string", async () => {
    await expect(
      comments.addReplyToComment(
        seedUserData[0]._id.toString(),
        seedPoemData[0].comments[0]._id.toString(),
        "Mon Nov 14 2023 00:05:49 GMT-0500 (Eastern Standard Time)",
        1,
        seedPoemData[0]._id.toString()
      )
    ).rejects.toThrow();
  });

  test("commentString_empty", async () => {
    await expect(
      comments.addReplyToComment(
        seedUserData[0]._id.toString(),
        seedPoemData[0].comments[0]._id.toString(),
        "Mon Nov 14 2023 00:05:49 GMT-0500 (Eastern Standard Time)",
        "",
        seedPoemData[0]._id.toString()
      )
    ).rejects.toThrow();
  });

  test("commentString_just_spaces", async () => {
    await expect(
      comments.addReplyToComment(
        seedUserData[0]._id.toString(),
        seedPoemData[0].comments[0]._id.toString(),
        "Mon Nov 14 2023 00:05:49 GMT-0500 (Eastern Standard Time)",
        "         ",
        seedPoemData[0]._id.toString()
      )
    ).rejects.toThrow();
  });

  test("timeCommented_not_a_string", async () => {
    await expect(
      comments.addReplyToComment(
        seedUserData[0]._id.toString(),
        seedPoemData[0].comments[0]._id.toString(),
        1,
        "test",
        seedPoemData[0]._id.toString()
      )
    ).rejects.toThrow();
  });

  test("timeCommented_empty", async () => {
    await expect(
      comments.addReplyToComment(
        seedUserData[0]._id.toString(),
        seedPoemData[0].comments[0]._id.toString(),
        "",
        "test",
        seedPoemData[0]._id.toString()
      )
    ).rejects.toThrow();
  });

  test("timeCommented_just_spaces", async () => {
    await expect(
      comments.addReplyToComment(
        seedUserData[0]._id.toString(),
        seedPoemData[0].comments[0]._id.toString(),
        "       ",
        "test",
        seedPoemData[0]._id.toString()
      )
    ).rejects.toThrow();
  });

  // TODO discuss date format and add/modify related tests

  test("no_user_with_userId", async () => {
    await expect(
      comments.addReplyToComment(
        "fefefefefefefefefefefefe",
        seedPoemData[0].comments[0]._id.toString(),
        "Mon Nov 14 2023 00:05:49 GMT-0500 (Eastern Standard Time)",
        "test",
        seedPoemData[0]._id.toString()
      )
    ).rejects.toThrow();
  });

  test("no_poem_with_poemId", async () => {
    await expect(
      comments.addReplyToComment(
        seedUserData[0]._id.toString(),
        seedPoemData[0].comments[0]._id.toString(),
        "Mon Nov 14 2023 00:05:49 GMT-0500 (Eastern Standard Time)",
        "test",
        "fefefefefefefefefefefefe"
      )
    ).rejects.toThrow();
  });

  test("no_comment_with_commentId", async () => {
    await expect(
      comments.addReplyToComment(
        seedUserData[0]._id.toString(),
        "fefefefefefefefefefefefe",
        "Mon Nov 14 2023 00:05:49 GMT-0500 (Eastern Standard Time)",
        "test",
        seedPoemData[0]._id.toString()
      )
    ).rejects.toThrow();
  });

  test("poem_has_no_comment_to_reply_to", async () => {
    await expect(
      comments.addReplyToComment(
        seedUserData[0]._id.toString(),
        seedPoemData[0].comments[0]._id.toString(),
        "Mon Nov 14 2023 00:05:49 GMT-0500 (Eastern Standard Time)",
        "should_throw",
        seedPoemData[2]._id.toString()
      )
    ).rejects.toThrow();
  });

  test("valid_add_reply_to_top_level_comment", async () => {
    const previous = await _poemCollection.findOne({
      _id: seedPoemData[0]._id,
    });
    let result = undefined;
    try {
      result = await comments.addReplyToComment(
        seedUserData[0]._id.toString(),
        seedPoemData[0].comments[0]._id.toString(),
        "Mon Nov 14 2023 00:05:49 GMT-0500 (Eastern Standard Time)",
        "This is a test reply",
        seedPoemData[0]._id.toString()
      );
    } catch (e) {
      throw new Error(`Test failed with error: ${e.toString()}`);
    }
    const current = await _poemCollection.findOne({ _id: seedPoemData[0]._id });

    // Check that function returned something
    expect(result).toBeTruthy();
    // That something must the be updated poem
    expect(result).toEqual(current);
    // That poem has one more comment than before
    expect(current.comments.length).toEqual(previous.comments.length + 1);

    // Find the specific comment we inserted
    const found = current.comments.find(
      (comment) =>
        comment.tagId.toString() === seedTagData[0]._id.toString() &&
        comment.userId.toString() === seedUserData[0]._id.toString() &&
        comment.timeCommented ===
          "Mon Nov 14 2023 00:05:49 GMT-0500 (Eastern Standard Time)" &&
        comment.commentString === "This is a test reply" &&
        comment.repliesTo !== null &&
        comment.repliesTo.toString() ===
          seedPoemData[0].comments[0]._id.toString()
    );
    // We found it
    expect(found).toBeTruthy();
  });

  test("valid_add_reply_to_reply", async () => {
    const previous = await _poemCollection.findOne({
      _id: seedPoemData[0]._id,
    });
    let result = undefined;
    try {
      result = await comments.addReplyToComment(
        seedUserData[2]._id.toString(),
        seedPoemData[0].comments[1]._id.toString(),
        "Mon Nov 14 2023 00:05:49 GMT-0500 (Eastern Standard Time)",
        "This is a reply to a reply",
        seedPoemData[0]._id.toString()
      );
    } catch (e) {
      throw new Error(`Test failed with error: ${e.toString()}`);
    }
    const current = await _poemCollection.findOne({ _id: seedPoemData[0]._id });

    // Check that function returned something
    expect(result).toBeTruthy();
    // That something must the be updated poem
    expect(result).toEqual(current);
    // That poem has one more comment than before
    expect(current.comments.length).toEqual(previous.comments.length + 1);

    // Find the specific comment we inserted
    const found = current.comments.find(
      (comment) =>
        comment.tagId.toString() === seedTagData[0]._id.toString() &&
        comment.userId.toString() === seedUserData[2]._id.toString() &&
        comment.timeCommented ===
          "Mon Nov 14 2023 00:05:49 GMT-0500 (Eastern Standard Time)" &&
        comment.commentString === "This is a reply to a reply" &&
        comment.repliesTo !== null &&
        comment.repliesTo.toString() ===
          seedPoemData[0].comments[1]._id.toString()
    );
    // We found it
    expect(found).toBeTruthy();
  });
});
