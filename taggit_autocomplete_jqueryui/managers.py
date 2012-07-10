# coding=utf-8
from taggit.forms import TagField
from taggit.managers import TaggableManager

from widgets import TagAutocomplete


class TaggableManagerAutocomplete(TaggableManager):
    def formfield(self, form_class=TagField, **kwargs):
        field = (super(TaggableManagerAutocomplete, self).
                 formfield(form_class, **kwargs))
        field.widget = TagAutocomplete()
        return field
