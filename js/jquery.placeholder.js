/*! http://mths.be/placeholder v1.8.7 by @mathias */
/*! https://github.com/LoonyPandora/jquery-placeholder - modifications by @LoonyPandora */

(function(window, document, $) {

    // Check to see if the browser suppors placeholders on both input & textareas
    // If it doesn't support both it's an ancient browser, and we'll use the fake placeholders for everything
    // Some browsers support input but not textarea. We don't handle that corner case. It's all or nothing.
    var isInputSupported = 'placeholder' in document.createElement('input'),
        isTextareaSupported = 'placeholder' in document.createElement('textarea'),
        prototype = $.fn,
        placeholder;

    if (isInputSupported && isTextareaSupported) {
        placeholder = prototype.placeholder = function() {
            return this;
        };

        // Expose the browser support outside the plugin
        placeholder.input = placeholder.textarea = true;
    } else {

        // Setup the swapping of values on focus / blur, etc - but NOT if we've already set it up
        // We add a ".placeholder" class if we've done anything to them
        placeholder = prototype.placeholder = function() {
            return this
                .not('.placeholder')
                .bind('focus.placeholder', clearPlaceholder)
                .bind('blur.placeholder', setPlaceholder)
                .trigger('blur.placeholder').end();
        };

        // Expose the browser support outside the plugin if it's not supported natively
        placeholder.input = isInputSupported;
        placeholder.textarea = isTextareaSupported;

        $(function() {
            // Find all forms that have placeholders in them
            $('form').bind('submit.placeholder', function() {
                // Clear the placeholder values so they don’t get submitted
                var $inputs = $('.placeholder', this).each(clearPlaceholder);
                setTimeout(function() {
                    $inputs.each(setPlaceholder);
                }, 10);
            });
        });

        // Clear placeholder values upon page reload - browsers may cache this
        $(window).bind('unload.placeholder', function() {
            $('.placeholder').val('');
        });
    }

    // Ancient jQuery is ancient
    function args(elem) {
        // Return an object of element attributes
        var newAttrs = {},
            rinlinejQuery = /^jQuery\d+$/;
        $.each(elem.attributes, function(i, attr) {
            if (attr.specified && !rinlinejQuery.test(attr.name)) {
                newAttrs[attr.name] = attr.value;
            }
        });
        return newAttrs;
    }

    // Clear a placeholder when a user focuses a field
    function clearPlaceholder() {
        var $input = $(this);
        if ($input.val() === $input.attr('placeholder') && $input.hasClass('placeholder')) {
            if ($input.data('placeholder-password')) {
                $input.hide().next().show().focus().attr('id', $input.removeAttr('id').data('placeholder-id'));
            } else {
                $input.val('').removeClass('placeholder');
            }
        }
    }

    // Set the value of a field based on the placeholder attr
    function setPlaceholder() {
        var $replacement,
            $input = $(this),
            $origInput = $input,
            id = this.id;
        if ($input.val() === '') {
            // We have to special case type=password - otherwise we get dots!
            // Clone it to a new type=text to get the proper values
            if ($input.is(':password')) {
                if (!$input.data('placeholder-textinput')) {
                    try {
                        $replacement = $input.clone().attr({ 'type': 'text' });
                    } catch(e) {
                        $replacement = $('<input>').attr($.extend(args(this), { 'type': 'text' }));
                    }
                    $replacement
                        .removeAttr('name')
                        // We could just use the `.data(obj)` syntax here, but that wouldn’t work in pre-1.4.3 jQueries
                        .data('placeholder-password', true)
                        .data('placeholder-id', id)
                        .bind('focus.placeholder', clearPlaceholder);
                    $input
                        .data('placeholder-textinput', $replacement)
                        .data('placeholder-id', id)
                        .before($replacement);
                }
                $input = $input.removeAttr('id').hide().prev().attr('id', id).show();
            }
            $input.addClass('placeholder').val($input.attr('placeholder'));
        } else {
            $input.removeClass('placeholder');
        }
    }

}(this, document, jQuery));
