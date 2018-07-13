// Grab the articles as a json
$.getJSON("/articles", function (data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
        // Display the apropos information on the page

        $("#articles").append("<div class='article-box' style='background: linear-gradient(rgba(255, 255, 255, 0.75),rgba(255, 255, 255, 0.75)), url(" + data[i].image + ");background-size: cover;'><p><a href='" + data[i].link + "' ><h2>" + data[i].title + "</h2></a></p><p>" + data[i].preview + "</p><button id='comment-button' data-id='" + data[i]._id + "'>Comment</button></div>");
    }
});

// Whenever someone clicks a p tag
$(document).on("click", "#comment-button", function () {
    // Empty the comments from the note section
    $("#comments").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");

    console.log("this is the variable thisId: "+thisId+" this is THIS: " +this)
    // Now make an ajax call for the Article
    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
        // With that done, add the note information to the page
        .then(function (data) {
            console.log(data);
            // The title of the article
            $("#comments").append("<h2>" + data.title + "</h2>");
            // An input to enter a new title
            $("#comments").append("<input id='titleinput' name='title' >");
            // A textarea to add a new note body
            $("#comments").append("<textarea id='bodyinput' name='body'></textarea>");
            // A button to submit a new note, with the id of the article saved to it
            $("#comments").append("<button data-id='" + data._id + "' id='savecomment'>Save Comment</button>");
            

            
            // If there's a note in the article
            if (data.comment) {
                // Place the title of the note in the title input
                $("#titleinput").val(data.comment.title);
                // Place the body of the note in the body textarea
                $("#bodyinput").val(data.comment.body);
            }
        });
});

$(document).on("click", "#load-articles", () => {
    $.ajax({
        method: "GET",
        url: "/scrape",
    }).then(function (data) {
        console.log(data);
        location.reload();
    })
})

// When you click the savecomment button
$(document).on("click", "#savecomment", function () {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            // Value taken from title input
            title: $("#titleinput").val(),
            // Value taken from comment textarea
            body: $("#bodyinput").val()
        }
    })
        // With that done
        .then(function (data) {
            // Log the response
            console.log(data);
            // Empty the comments section
            $("#comments").empty();
        });

    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
});