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
    poemId = validation.checkId(poemId, "poemId");

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
    poemId = validation.checkId(poemId, "poemId");

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

  async getRepliesToComment(commentId, depth) {
    /**
     * The goal would be to get a recursive object describing comments in the same fashion described in the first db design:
     * comment: {
     * _id: commentId,
     * tagId: tagId,
     * userId: userId,
     * timeCommented: some date,
     * commentString: "",
     * replies: [
     *    <array_of_comments>, with each having a "replies" field itself
     *    another array
     *    ]
     * }
     *
     * Some insights:
     *  - build an aggragation pipeline to get comments as root of the projection
     *  - use graphLookup to build the tree structure
     * Check out:
     * https://stackoverflow.com/questions/65139097/make-node-tree-with-recursive-table-with-express-and-mongo
     * https://stackoverflow.com/questions/64515836/how-to-replace-root-with-an-array-field-during-mongodb-aggregation-pipeline
     */
  },

  async addCommentToPoem(userId, tagId, timeCommented, commentString, poemId) {
    userId = validation.checkId(userId, "userId");
    tagId = validation.checkId(tagId, "tagId");
    poemId = validation.checkId(poemId, "poemId");

    timeCommented = validation.checkDateString(timeCommented, "timeCommented");

    // TODO discuss and implement other restrictions for comments
    commentString = validation.checkString(commentString);

    const userCollection = await users();
    const userById = await userCollection.findOne({
      _id: new ObjectId(userId),
    });
    if (!userById)
      throw new Error(`addCommentToPoem: no user found with userId ${userId}`);

    const poemCollection = await poems();
    const poemById = await poemCollection.findOne({
      _id: new ObjectId(poemId),
    });
    if (!poemById)
      throw new Error(`addCommentToPoem: no poem found with poemId ${poemId}`);

    // TODO discuss whether adding a comment also automatically adds tag
    // FIXME behaviour when tag is found but tagCount is 0
    let tagFound = false;
    for (let tag of poemById.submittedTags) {
      if (tag.tagId.toString() === tagId) tagFound = true;
    }

    if (!tagFound)
      throw new Error(
        `addCommentToPoem: could not find tag with id ${tagId} for poem ${poemId}`
      );

    const updatedPoem = await poemCollection.findOneAndUpdate(
      { _id: new ObjectId(poemId) },
      {
        $push: {
          comments: {
            _id: new ObjectId(),
            tagId: new ObjectId(tagId),
            userId: new ObjectId(userId),
            timeCommented: timeCommented,
            commentString: commentString,
            repliesTo: null,
          },
        },
      },
      { returnDocument: "after" }
    );

    if (updatedPoem === null)
      throw new Error("addCommentToPoem: could not add the comment");
    return updatedPoem;
  },

  async addReplyToComment(
    userId,
    commentId,
    timeCommented,
    commentString,
    poemId
  ) {
    userId = validation.checkId(userId, "userId");
    commentId = validation.checkId(commentId, "commentId");
    poemId = validation.checkId(poemId, "poemId");

    timeCommented = validation.checkDateString(timeCommented, "timeCommented");

    // TODO discuss and implement other restrictions for comments
    commentString = validation.checkString(commentString);

    const userCollection = await users();
    const userById = await userCollection.findOne({
      _id: new ObjectId(userId),
    });
    if (!userById)
      throw new Error(`addReplyToComment: no user found with userId ${userId}`);

    const poemCollection = await poems();
    const poemById = await poemCollection.findOne({
      _id: new ObjectId(poemId),
    });
    if (!poemById)
      throw new Error(`addReplyToComment: no poem found with poemId ${poemId}`);

    const foundComment = poemById.comments.find(
      (comment) => comment._id.toString() === commentId
    );
    if (!foundComment)
      throw new Error(
        `addReplyToComment: no comment with commentId ${commentId} found in poem ${poemId}`
      );

    const updatedPoem = await poemCollection.findOneAndUpdate(
      { _id: new ObjectId(poemId) },
      {
        $push: {
          comments: {
            _id: new ObjectId(),
            tagId: foundComment.tagId,
            userId: new ObjectId(userId),
            timeCommented: timeCommented,
            commentString: commentString,
            repliesTo: foundComment._id,
          },
        },
      },
      { returnDocument: "after" }
    );

    if (updatedPoem === null)
      throw new Error("addCommentToPoem: could not add the comment");
    return updatedPoem;
  },

  async removeCommentFromPoem(commentId, poemId, deleteReplies = false) {
    commentId = validation.checkString(commentId, "commentId");
    poemId = validation.checkString(poemId, "poemId");

    const poemCollection = await poems();
    const poemById = await poemCollection.findOne({
      _id: new ObjectId(poemId),
    });
    if (!poemById)
      throw new Error(
        `removeCommentFromPoem: no poem found with poemId ${poemId}`
      );

    const foundComment = poemById.comments.find(
      (comment) => comment._id.toString() === commentId
    );
    if (!foundComment)
      throw new Error(
        `removeCommentFromPoem: no comment with commentId ${commentId} found in poem ${poemId}`
      );

    let commentsToRemove = [foundComment._id.toString()];

    // FIXME Tree traversal algo is O(n^2) because parent reference is used(instead of child ref). Need to do better
    if (deleteReplies) {
      const replies = [];
      const stack = [foundComment];

      while (stack.length > 0) {
        let current = stack.pop();
        for (let potentialReply of poemById.comments) {
          if (
            !!potentialReply.repliesTo &&
            potentialReply.repliesTo.toString() === current._id.toString()
          ) {
            replies.push(potentialReply);
            stack.push(potentialReply);
          }
        }
      }

      commentsToRemove.push(
        ...replies.map((comment) => comment._id.toString())
      );
    }
    commentsToRemove = commentsToRemove.map(
      (idString) => new ObjectId(idString)
    );

    const updatedPoem = await poemCollection.findOneAndUpdate(
      { _id: new ObjectId(poemId) },
      {
        $pull: { comments: { _id: { $in: commentsToRemove } } },
      },
      { returnDocument: "after" }
    );

    if (updatedPoem === null)
      throw new Error(`removeCommentFromPoem: could not remove the poem`);
    return updatedPoem;
  },

  async updateCommentPut() {},
  async updateCommentPatch() {},
};

export default exportedMethods;
