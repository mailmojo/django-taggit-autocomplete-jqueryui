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
				$hidden.attr('type', 'hidden');
				$taglist = $hidden.parent().children('.tags');

				// Hooks up event listenere to enable remove
				$taglist.click(remove);

				// Adds enter key event on autocomplete input
				$input.on('keydown', function (e) {
					// Check `keyCode` too for legacy Chrome and Safari support.
					if (e.key === 'Enter' || e.keyCode === 13) {
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

	/*
	 * Initialize a widget based on a definition containing the input element
	 * selector and the URL for the backend endpoint to retrieve tags from.
	 */
	function auto_init (selector, endpoint) {
		root.Taggit.init(selector);
        $(selector).autocomplete({
            source: endpoint,
            select: root.Taggit.autocomplete
        });
	}

	/*
	 * Check for init queue set up before this file was loaded, and
	 * run auto-initialization of each defined widget.
	 */
    if (root.taggit_init) {
        $.each(root.taggit_init, function (i, defn) {
            auto_init(defn[0], defn[1]);
        });
    }

	// Handle additions to the auto-init queue directly after this file is loaded
	root.taggit_init = {
		push: function (defn) {
			auto_init(defn[0], defn[1]);
		}
	};

})(window, window.django.jQuery || window.jQuery);
