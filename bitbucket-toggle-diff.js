"use strict";

$(function() {
    $("head").append(
        "<style>" +
        ".comment-tag { " +
        "    margin-right: 0.7em;" +
        "} " +
        ".comment-tag-input { " +
        "    font-size: inherit !important;" +
        "    line-height: 1 !important;" +
        "    height: 1.5em !important;" +
        "    padding: 0 !important;" +
        "    position: relative !important;" +
        "    top: -1px !important;" +
        "} " +
        "</style>"
    );
});

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

    function addTagSelector($comment) {
        var $input = $("<input type='text' class='comment-tag-input'>");
        var $tags = $("<span class='comment-tags'></span>");

        $input.on("keydown", function(e) {
            if (e.keyCode === 13 && !/^ *$/.test($input.val())) {
                addTag($tags, $input.val());
                $input.val("");
            }
        });

        var $li = $("<li></li>");
        $li.append($tags);
        $li.append($input);

        $comment.find(" > .comments-list > .comment > article > .comment-actions").append($li);
    }

    function addTag($tags, tagName) {
        var $tagLink = $("<a href='#' class='comment-tag' title='Click to remove'>#"+tagName+"</a>");

        $tagLink.on("click", function(e) {
            e.preventDefault();
            $tagLink.remove();
        });

        $tags.append($tagLink);
    }

    $(".comment-thread-container").each(function(){
        addShowHideLink($(this));
        addTagSelector($(this));
    });
}

// Run automatically on page load
$(window.toggleDiff);
