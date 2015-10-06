"use strict";

$(function(){

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

});
