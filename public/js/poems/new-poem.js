import validation from "/public/js/validation.js";

(function ($) {
   let form = $("#edit-poem-form"),
      title_error = $("#title_error"),
      body_error = $("#body_error"),
      link_error = $("#link_error"),
      success = $("#success"),
      private_error = $("#private_error");

   form.submit(function (event) {
      event.preventDefault();

      let poemId = $("#poemId").text(),
         title = $("#title_input").val().trim(),
         body = $("#poem-body-area").val().trim(),
         linkInput = $("#reading-link").val().trim(),
         priv = $("#private-checkbox").val();

      let errors_exist = false;
      title_error.text("");
      body_error.text("");
      link_error.text("");
      private_error.text("");

      let data = {};
      try {
         title = validation.checkTitle(title);
         data.title = title;
      } catch (e) {
         console.error(e.message);
         title_error.text(e.message);
         errors_exist = true;
      }

      try {
         body = validation.checkBody(body);
         data.body = body;
      } catch (e) {
         console.error(e.message);
         body_error.text(e.message);
         errors_exist = true;
      }

      if (linkInput !== "") {
         try {
            linkInput = validation.checkUrl(linkInput);
            data.linkInput = linkInput;
         } catch (e) {
            console.error(e.message);
            link_error.text(e.message);
            errors_exist = true;
         }
      }

      if (["true", "false"].includes(priv)) {
         data.priv = priv;
      }

      if (!errors_exist) {
         $.ajax({
            url: `/poems/edit/${poemId}`,
            method: "PATCH",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data) {
               console.log(data.success);
               success.text(data.success);
               window.location.href = "/user";
            },
            error: function (e) {
               console.log(e);
               // console.error(e.responseJSON.error);
               // error.text(e.responseJSON.error);
            },
         });
      }
   });
})(window.jQuery);
