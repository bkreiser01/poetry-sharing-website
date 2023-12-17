import validation from "/public/js/validation.js"

(function ($) {
    let search_form = $("#search-form"),
        search_bar = $("#search-bar"),
        search_select = $("#search-select"),
        default_canvas = $("#default-canvas"),
        search_canvas = $("#search-canvas"),
        back_button = $("#closeSearchResults"),
        searchResults = $("#searchResults"),
        error = $("#error")

    search_form.submit((event) => {
        event.preventDefault()
        error.text("")
        searchResults.empty()
        let failed = false
        let searchTerm

        try {
            searchTerm = validation.checkString(search_bar.val().toLowerCase())
        } catch (e) {
            error.text("Invalid search term")
            failed = true
        }

        let searchType
        try {
            searchType = validation.checkString(search_select.val().toLowerCase())
        } catch (e) {
            error.text("Invalid search type")
            failed = true
        }

        if (!failed) {
            let url = `/search/${searchType}/${searchTerm}`
            console.log(url)

            $.ajax({
                url: url,
                type: "GET",
                success: (data) => {
                    if (data.length == 0) {
                        error.text("No results found")
                    } else {
                        console.log(data)
                        for (let i = 0; i < data.length; i++) {
                            switch (searchType) {
                                case "users":
                                    searchResults.append(`<li><a href="/user/${data[i]._id}">${data[i].username}</a></li>`)
                                    break
                                case "poems":
                                    searchResults.append(`<li><a href="/poems/${data[i]._id}">${data[i].title}</a></li>`)
                                    break
                                case "tags":
                                    searchResults.append(`<li><a href="/tags/${data[i]._id}">${data[i].tagString}</a></li>`)
                                    break
                                default:
                                    error.text("Invalid search type")
                                    break
                            }
                        }
                        default_canvas.hide()
                        search_canvas.show()
                    }
                },
                error: (e) => {
                    console.log(e)
                    error.text("No results found")
                }
            })
        }
    })

    back_button.click(() => {
        default_canvas.show()
        search_canvas.hide()
    })
}(window.jQuery))