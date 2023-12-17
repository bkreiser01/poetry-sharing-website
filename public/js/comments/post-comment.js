import validation from "../validation.js";

let errored;

function removeLeadingErrors(str) {
  let words = str.split(/\s+/);
  let filteredWords = words.map((word) =>
    word.toLowerCase() !== "error:" ? word : ""
  );
  return filteredWords.join(" ").trim();
}

let validate = (data, func, err) => {
  try {
    data = func(data);
  } catch (e) {
    err.text(removeLeadingErrors(e.toString()));
    errored = true;
  }

  return data;
};

(function ($) {
  let tagSelect = $("#tag-select");
  let poemId = $("#poemViewId")[0].innerText;
  let tags;

  // FIXME Load the tags into the select
  $.ajax({
    url: `/poems/getPoemById/${poemId}`,
    type: "GET",
    success: function (poem) {
      for (let tag of poem.submittedTags) {
        let tagId = tag.tagId;
        let tagString = "[deleted]";
        $.ajax({
          url: `/`, // here
          type: "GET",
          success: function (tag) {
            tagString = tag.tagString;
          },
          error: function (err) {
            console.error(err);
          },
        });
        tagSelect.append(
          $("<option>", {
            value: tagId,
            text: tagString,
          })
        );
      }
    },
    error: function (err) {
      console.error(err);
    },
  });

  let commentForm = $("#post-comment-form");
  let commentBodyError = $("#comment-body-error");

  let tagSelectError = $("#tag-select-error");
  let error = $("#error");

  // Handle the form submission
  commentForm.submit(function (event) {
    event.preventDefault();

    let commentBody = $("#comment-body");
    let tagSelection = $("#tag-select");
    // let poemId = $('#poemViewId')[0].innerText
    commentBodyError.text("");
    tagSelectError.text("");
    errored = false;

    let data = {
      // get the user id in the route
      // userId: $("#userId").val(),
      tagId: tagSelection.val(),
      // get the time commented in the route
      // timeCommented: Date.now(),
      commentString: commentBody.val(),
      // poemId is from the route params
      // poemId: poemId,
    };

    // FIXME can we actually import ObjectId to check ObjectIds client-side?
    data.tagId = validate(data.tagId, validation.checkString, tagSelectError);
    data.commentString = validate(
      data.commentString,
      validation.checkBody,
      commentBodyError
    );
    // FIXME validation might not be necessary as this will always be passed as valid id
    // data.poemId = validate(data.poemId, validation.checkString, error);

    if (errored) {
      errored = false;
      console.error("Form validation failed");
      return;
    }

    $.ajax({
      url: `/poems/${poemId}/comments`,
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(data),
      success: function (data) {
        console.log("success");
        if (data.success) {
          window.location.reload();
        }
      },
      error: function (err) {
        console.error(e.responseJSON.error);
        error.text(e.responseJSON.error);
      },
    });
  });
});
