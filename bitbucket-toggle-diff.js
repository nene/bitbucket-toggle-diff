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
        // Remove the annoying pop-up menu of bitbucket
        "div[aria-controls='sidebar-submenu0'] { " +
        "    display: none;" +
        "} " +
        "</style>"
    );
    $("body").append(
        "<datalist id='comment-tags-list'>" +
            "<option value='BEM' />" +
            "<option value='Code organization' />" +
            "<option value='Commented out code' />" +
            "<option value='Commit style' />" +
            "<option value='Consistency' />" +
            "<option value='Coupling' />" +
            "<option value='CSS-specific' />" +
            "<option value='Dead code' />" +
            "<option value='Docs' />" +
            "<option value='DRY' />" +
            "<option value='Encapsulation' />" +
            "<option value='JavaScript-specific' />" +
            "<option value='Magic numbers' />" +
            "<option value='Many parameters' />" +
            "<option value='Naming' />" +
            "<option value='Needless code' />" +
            "<option value='OOP' />" +
            "<option value='Optimization' />" +
            "<option value='Shared state' />" +
            "<option value='Shorten' />" +
            "<option value='Side-effects' />" +
            "<option value='Single Responsibility' />" +
            "<option value='Spelling/Grammar' />" +
            "<option value='Test docs' />" +
            "<option value='Test does not work' />" +
            "<option value='Test missing' />" +
            "<option value='Test not a unit test' />" +
            "<option value='Test with hard-coded data' />" +
            "<option value='Whitespace' />" +
            "<option value='YAGNI' />" +
        "</datalist>"
    )
});

// Expose as global to be able to invoke manually
window.toggleDiff = function() {
    function isDiffLine($line) {
        return $line.hasClass("addition") || $line.hasClass("deletion");
    }

    function findFirstDiffLine($line) {
        while (isDiffLine($line.prev())) {
            $line = $line.prev();
        }
        return $line;
    }

    function findDiffLines($startLine) {
        var $line = findFirstDiffLine($startLine);
        var lines = [$line];
        while (isDiffLine($line.next())) {
            $line = $line.next();
            lines.push($line);
        }
        return lines;
    }

    function hideDiffLine($line) {
        if ($line.hasClass("deletion")) {
            $line.remove();
        }
        else {
            $line.removeClass("addition").addClass("common");
        }
    }

    function addDiffLineButtons($diffContainer) {
        var $button = $("<button style='position:absolute; top:0; right: 0'>x</button>");

        $diffContainer.on("mouseover", ".udiff-line", function(e) {
            var $currentLine = $(e.target).closest(".udiff-line");
            $button.remove();

            if (!isDiffLine($currentLine)) {
                return;
            }

            $currentLine.css({position: "relative"});
            $currentLine.append($button);

            $button.on("click", function() {
                findDiffLines($currentLine).forEach(hideDiffLine);
                $button.remove();
            });
        });
    }

    $(".diff-container").each(function(){
        addDiffLineButtons($(this));
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
        $li.append($link);

        $comment.find(" > .comment-actions").append($li);
    }

    function addTagSelector($comment) {
        var $input = $("<input type='text' class='comment-tag-input' list='comment-tags-list'>");
        var $tags = $("<span class='comment-tags'></span>");
        var allTags = new Tags($comment.attr("id"));

        $input.on("keydown", function(e) {
            var tagName = $input.val();
            if (e.keyCode === 13 && !/^ *$/.test(tagName)) {
                allTags.add(tagName);
                addTag($tags, tagName, allTags);
                $input.val("");
            }
        });

        var $li = $("<li></li>");
        $li.append($tags);
        $li.append($input);

        allTags.forEach(function(tagName) {
            addTag($tags, tagName, allTags);
        });

        $comment.find(" > .comment-actions").append($li);
    }

    function addTag($tags, tagName, allTags) {
        var $tagLink = $("<a href='#' class='comment-tag' title='Click to remove'>#"+tagName+"</a>");

        $tagLink.on("click", function(e) {
            e.preventDefault();
            $tagLink.remove();
            allTags.remove(tagName);
        });

        $tags.append($tagLink);
    }

    function Tags(commentId) {
        this.id = commentId;
        this.tags = localStorage[commentId] ? JSON.parse(localStorage[commentId]).tags : [];
    }
    Tags.prototype = {
        add: function(tag) {
            this.tags.push(tag);
            this.save();
        },
        remove: function(tag) {
            this.tags = this.tags.filter(function(t) { return t !== tag; })
            this.save();
        },
        save: function() {
            var commit = window.location.href.match(/commits\/([0-9a-f]+)(?:#.*)?$/)[1];
            localStorage[this.id] = JSON.stringify({tags: this.tags, commit: commit});
        },
        forEach: function(cb) {
            this.tags.forEach(cb);
        }
    };

    $(  // Handle both general comments and comments within diffs
        "#general-comments .comments-list > .comment > article, " +
        ".comment-thread-container > .comments-list > .comment > article"
    ).each(function(){
        addShowHideLink($(this));
        addTagSelector($(this));
    });
}

// Run automatically on page load
$(window.toggleDiff);
