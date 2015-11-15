(function ($) {
    $.fn.dropdownstyle = function (options) {
        var color_codes = ["green", "blue"];
        var settings = $.extend({
            theme: 'green',
            is_search: false,
            complete: null,
            on_change: null,
            is_hide: true
        }, options);
        return this.each(function () {
            if ($(this).is('select')) {
                settings.theme = settings.theme.trim().toLowerCase();
                if (jQuery.inArray(settings.theme, color_codes) == -1) {
                    settings.theme = 'green';
                }
                var arr = [];
                $(this).children().each(function () {
                    if ($(this).is('option'))
                        arr.push({ optgroup: '0', value: $(this).val(), text: $(this).text() });
                    else
                        arr.push({ optgroup: '1', value: $(this).val(), text: $(this).text() });
                });
                outer = $('<div>').attr('class', 'dropdown_simple ' + settings.theme);
                sel = $('<ul>');
                span = $('<span>').attr('class', 'dropdown_selected ' + settings.theme);
                $(span).append('<img src="images/arrow-down.png"/><a href="javascript:;"></a>');
                index = 0;
                $(arr).each(function (i, d) {
                    if (index == 0 && this.optgroup == '0') {
                        index = 1;
                        span.find('a').text(this.text);
                    }
                    li = $("<li>");
                    if (this.optgroup == '1')
                        li.append('<h2>' + this.text + '</h2>');
                    else
                        li.append('<a data-dropdown="' + this.value + '" href="javascript:;">' + this.text + '</a>');
                    sel.append(li);
                });
                $(this).replaceWith($(outer));
                $(outer).append(sel);
                $(sel).before(span);
                if (settings.is_search == true) {
                    $(sel).prepend('<h1><input class="dropdown_search ' + settings.theme + '" type="text" autocomplete="off" autocorrect="off" autocapitalize="off"/></h1>');
                    $(sel).find('.dropdown_search').on("keyup", function (event) {
                        rows = $(sel).find("li").hide();
                        value = '';
                        if ($(this).val().trim() != '') {
                            value = $(this).val().trim().toLowerCase();
                            rows.each(function () {
                                var el = $(this).find('a').text().trim().toLowerCase();
                                if (el.indexOf(value) > -1) {
                                    $(this).show();
                                }
                            });
                        }
                        else
                            rows.show();
                    });
                }

                $('.dropdown_selected').off("click");
                $('.dropdown_simple').find('ul li a').off("click");
                $(document).off("click");
                $('.dropdown_selected').on("click", function (event) {
                    event.stopPropagation();
                    $('.dropdown_simple').find('ul').slideUp();
                    $(this).next('ul').slideToggle();
                });
                $('.dropdown_simple').find('ul li a').on("click", function (event) {
                    event.stopPropagation();
                    $(this).parents('ul').prev('span').find('a').text($(this).text());
                    if ($.isFunction(settings.on_change)) {
                        obj = { value: $(this).attr('data-dropdown'), text: $(this).text() };
                        settings.on_change.call(this, obj);
                    }
                    if (settings.is_hide == true) {
                        $(this).parents('ul').slideToggle();
                    }
                });
                $(document).on("click", function (event) {
                    if (!$(event.target).is($(span)) && !$(event.target).is($(span).next('ul')) && !$(event.target).is($(sel).find('.dropdown_search')) && !$(event.target).is($(span).children())) {
                        $('.dropdown_simple ul').slideUp();
                    }
                });
                if ($.isFunction(settings.complete)) {
                    settings.complete.call(this);
                }
            }
        });
    }
} (jQuery));