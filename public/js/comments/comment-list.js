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
                        <a href="/user/${user._id}">${user.username}</a>(<a href="/tags/${tag._id}">${tag.tagString}</a>):
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
                        <a href="/users/${user.userId}>${user.username}</a>
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
