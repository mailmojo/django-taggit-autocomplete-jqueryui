(function (root, $) {
	root.Taggit = (function () {
		var
			$hidden,
			$taglist;

		function updateTags () {
			$hidden.val(
				$taglist.children('li')
					.map(function (i, el) {
						return $(el).attr('data-tag');
					})
					.get()
					.join(', ')
			);
		}

		function remove (e) {
			var $target = $(e.target).closest('.remove');
			e.preventDefault();
			if ($target.length > 0) {
				$target.parent().remove();
				updateTags();
			}
		}

		function addTags ($input) {
			var tags = $input.val().split(',');
			$.each(tags, function (i, tag) {
				addTagToList($.trim(tag.toLowerCase()));
			});
			$input.val('');
		}

		function addTagToList (tag) {
			if ($taglist.children('li[data-tag="' + tag + '"]').length === 0) {
				$taglist.append(
					'<li data-tag="' + tag + '">' +
						'<span class="name">' + tag + '</span>' +
						'<a href="#" class="remove">x</a>' +
					'</li>'
				);
				updateTags();
			}
		}

		return {
			init: function (inputSelector) {
				var $input = $(inputSelector);
				$hidden = $('#' + $input.attr('id').replace('_autocomplete', ''));
				$taglist = $hidden.parent().children('.tags');

				// Hooks up event listenere to enable remove
				$taglist.click(remove);

				// Adds enter key event on autocomplete input
				$input[$.browser.safari || $.browser.msie ?
						'keydown' : 'keypress'](function (e) {
					if (e.keyCode === 13) {
						e.preventDefault();
						addTags($(e.target));
					}
				});

				// Make sure tags in the text input field are added before the form is submitted
				$($input[0].form).submit(function () {
					if ($input.val().length > 0) {
						addTags($input);
					}
				});
			},

			autocomplete: function (e, ui) {
				e.preventDefault();
				$(e.target).val('');
				addTagToList(ui.item.value);
			}
		};
	})();
})(window, django.jQuery);
