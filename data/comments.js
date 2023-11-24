import * as connections from "../config/mongoConnection.js";
import { poems, users, tags } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import validation from "../helpers/validation.js";

const exportedMethods = {
  async getCommentById(commentId) {
    commentId = validation.checkId(commentId, "commentId");
    const poemCollection = await poems();

    const commentById = await poemCollection.findOne(
      {
        "comments._id": new ObjectId(commentId),
      },
      { projection: { _id: 0, "comments.$": 1 } }
    );

    if (commentById === null)
      throw new Error(`getCommentById: no comment found with id ${commentId}`);
    return commentById.comments[0];

    // TODO If we want to go back to recursive reply structure, I found this that could help (but did not work)
    // https://www.mongodb.com/community/forums/t/how-to-query-multi-level-nested-sub-document-objects-when-the-sub-document-id-is-known/172978
  },

  async getAllCommentsFromPoem(poemId) {
    poemId = validation.checkId(poemId);

    const poemCollection = await poems();

    const poemById = await poemCollection.findOne({
      _id: new ObjectId(poemId),
    });
    if (poemById === null)
      throw new Error(
        `getAllCommentsFromPoem: no poem found with id ${poemId}`
      );
    return poemById.comments;
  },

  async getTopLevelCommentsFromPoem(poemId) {
    poemId = validation.checkId(poemId);

    const poemCollection = await poems();
    const poemOnlyTopLevelComments = await poemCollection
      .aggregate([
        {
          $match: { _id: new ObjectId(poemId) },
        },
        {
          $project: {
            comments: {
              $filter: {
                input: "$comments",
                as: "comment",
                cond: { $eq: ["$$comment.repliesTo", null] },
              },
            },
          },
        },
      ])
      .toArray();

    if (poemOnlyTopLevelComments.length === 0)
      throw new Error(
        `getTopLevelCommentsFromPoem: no poem found with id ${poemId}`
      );

    return poemOnlyTopLevelComments[0].comments;
  },

  async getRepliesToComment(commentId, depth) {},

  async addCommentToPoem() {},
  async addReplyToComment() {},

  async removeCommentFromPoem() {},

  async updateCommentPut() {},
  async updateCommentPatch() {},
};

export default exportedMethods;
