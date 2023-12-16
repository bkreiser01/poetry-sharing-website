//Handle tag, save, and like functionality on poem view page

import validation from './validation.js';

(function($) {
    let PoemActions = $('.poem-actions');
    let TagButton = $('#TagIt');
    let LikeButton = $('#SaveIt');
    let SaveButton = $('#LikeIt');

    TagButton.click(function (event) {
        //Empty poem-actions div, and add form to submit tag
        PoemActions.empty();
        PoemActions.append("<form id='addTagForm'></form>");
        let TagForm = $('#addTagForm');
        TagForm.append("<label for='TagString'>Tag:</label>");
        TagForm.append("<input type='text' id='TagString' name='TagString'>");
        TagForm.append("<input type='submit' value='Submit'>");
    })

    LikeButton.click(function (event) {
    })

    SaveButton.click(function (event) {
    })

})(window.jQuery)