"use strict";

// Expose as global to be able to invoke manually
window.toggleDiff = function() {
    $(".diff-container").each(function(){
        var content = $(this).find(".diff-content-container");

        var button = $('<a href="#" class="aui-button aui-button-light" resolved="">Hide</a>');
        button.on("click", function(e) {
            e.preventDefault();
            content.toggle();
            button.text(button.text() === "Hide" ? "Show" : "Hide");
        });

        var group = $("<div class='aui-buttons'></div>");
        group.append(button);

        $(this).find(".diff-actions").prepend(group);
    });

    function addShowHideLink($comment) {
        var $link = $("<a href='#'>Hide</a>");
        $link.on("click", function(e) {
            e.preventDefault();

            var isHidden = ($link.text() === "Hide");
            $link.text(isHidden ? "Show" : "Hide");
            $comment.css("opacity", isHidden ? 0.5 : 1);
        });

        var $li = $("<li></li>");
        $li.append($link)

        $comment.find(" > .comments-list > .comment > article > .comment-actions").append($li);
    }

    $(".comment-thread-container").each(function(){
        addShowHideLink($(this));
    });
}

// Run automatically on page load
$(window.toggleDiff);
