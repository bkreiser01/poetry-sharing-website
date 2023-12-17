(function ($) {
  let poem_comments = $("#poem-comments");
  let poemId = $("#poemViewId")[0].innerText;

  $.ajax({
    url: `/poems/${poemId}/comments`,
    type: "GET",
    success: function (comments) {
      comments = comments.sort((a, b) => {
        let dateA = new Date(a.timeCommented);
        let dateB = new Date(b.timeCommented);

        return dateB - dateA;
      });
      for (let comment of comments) {
        // Let's assume that a user will never be deleted
        $.ajax({
          url: `/user/searchById/${comment.userId}`,
          type: "GET",
          success: function (user) {
            $.ajax({
              url: `/tags/info/${comment.tagId}`,
              type: "GET",
              success: function (tag) {
                poem_comments.append(`
                <li class="poem-comment-container">
                    <div class="poem-comment-author-info">
                        <p>${user.username}</p>
                        <p>${tag.tagString}</p>
                    </div>
                    <p class="comment-string">
                        ${comment.commentString}
                    </p>
                </li>
                `);
              },
              error: function (err) {
                // The tag was deleted
                poem_comments.append(`
                <li class="poem-comment-container">
                    <div class="poem-comment-author-info">
                        <p>${user.username}</p>
                        <p>[deleted]</p>
                    </div>
                    <p class="comment-string">
                        ${comment.commentString}
                    </p>
                </li>
                `);
              },
            });
          },
          error: function (err) {
            // Ideally, here fetch the tag and set username to [deleted]
            console.error(err);
          },
        });
      }
    },
    error: function (err) {
      console.error(err);
    },
  });
})(window.jQuery);
