(function ($) {
    let method = $('#method_name')[0].innerText,
    poems_list = $('#poems_list'),
        searchId
    
    if ($('#userViewId').length != 0) {
        searchId = $('#userViewId')[0].innerText
    } else {
        searchId = $('#userId')[0].innerText
    }

    $.ajax({
        url: `/user/${method}/${searchId}`,
        type: 'GET',
        success: function (poems) {
            for (let i=0; i < poems.length; i++) { 
                // this is a special case for the taggedpoems
                if (typeof poems[i] === 'object') {
                    poems[i] = poems[i].poemId
                }
                $.ajax({
                    url: `/poems/getPoemById/${poems[i]}`,
                    type: 'GET',
                    success: function (poem) {
                        poems_list.append(`<li><a href="/poems/${poem._id}">${poem.title}</a></li>`)
                    },
                    error: function (err) {
                        console.error(err);
                    }
                });
            }
        },
        error: function (err) {
            console.error(err);
        }
    });
}(window.jQuery))