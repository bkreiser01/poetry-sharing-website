(function ($) {
  let method = $("#method_name")[0].innerText;
  let poem_comments = $("#poem-comments");
  let poemId = $("#poemViewId")[0].innerText;

  $.ajax({
    url: `/poems/${poemId}/comments`,
    type: "GET",
    success: function (comments) {
      for (let comment of comments) {
        // In case we don't find the user or the tag, let's just assume it was deleted.
        let username = "[deleted]";
        let tagname = "[deleted]";

        // Fetch the username
        $.ajax({
          url: `/user/searchById/${comment.userId}`,
          type: "GET",
          success: function (user) {
            username = user.username;
          },
          error: function (err) {
            console.error(err);
          },
        });

        // FIXME Fetch the tagname
        $.ajax({
            url: `/`,
            type: "GET",
            success: function (tag) {
                tagname = tag.tagString;
            },
            error: function (err) {
                console.error(err);
            }
        })
        poem_comments.append(`
            <li class="poem-comment-container">
                <div class="poem-comment-author-info">
                    <p>${username}</p>
                    <p>${tagname}</p>
                </div>
                <p class="comment-string">
                    ${comment.commentString}
                </p>
            </li>
            `);
      }
    },
    error: function (err) {
        console.error(err);
    }
  });
});
