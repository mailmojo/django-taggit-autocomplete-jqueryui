# -*- coding: utf-8 -*-
from django.forms.widgets import Input
from django.core.urlresolvers import reverse
from django.utils.safestring import mark_safe

from taggit.utils import edit_string_for_tags, split_strip

MEDIA_URL = '/media/taggit_autocomplete_jqueryui'


class TagAutocomplete(Input):
    input_type = 'hidden'

    class Media:
        css = {
            'all': ('%s/css/jquery-ui-1.8.20.custom.css' % MEDIA_URL, )
        }
        js = (
            '%s/js/jquery-ui-1.8.20.custom.min.js' % MEDIA_URL,
            '%s/js/autocomplete.js' % MEDIA_URL,
        )

    def render(self, name, value, attrs=None):
        if value is not None and not isinstance(value, basestring):
            # value contains a list a TaggedItem instances
            # Here we retrieve a comma-delimited list of tags
            # suitable for editing by the user
            tags = [o.tag for o in value.select_related('tag')]
            value = edit_string_for_tags(tags)
        elif value is not None:
            tags = split_strip(value)

        json_view = reverse('taggit_autocomplete_jqueryui_tag_list')

        html = u'<ul class="tags">'
        for tag in tags:
            html += (u'<li data-tag="%(name)s">%(name)s</li>' %
                    {'name': tag.name})
        html += '</ul>'
        html += super(TagAutocomplete, self).render(name, value, attrs)
        html += u'<input type="text" id="%s_autocomplete"/>' % attrs['id']

        js = u'''
            <script type="text/javascript">
                django.jQuery(document).ready(function($) {
                    $("#%s_autocomplete").autocomplete({
                        source: "%s",
                        select: Taggit.autocomplete
                    });
                });
            </script>''' % (attrs['id'], json_view)
        return mark_safe("\n".join([html, js]))
