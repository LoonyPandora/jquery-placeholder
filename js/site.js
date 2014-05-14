$(function() {
    // Invoke the plugin
    $('input, textarea').placeholder();

    // For the demo, show a message if the browser is doing it natively, or if the plugin is working
    if ($.fn.placeholder.input && $.fn.placeholder.textarea) {
        $("<p/>")
            .html("<strong>Your current browser natively supports <code>placeholder</code> for <code>input</code> and <code>textarea</code> elements.</strong> The plugin won’t run in this case, since it’s not needed. If you want to test the plugin, use an older browser!")
            .addClass("alert alert-warning")
            .insertBefore('form');
    }
});
