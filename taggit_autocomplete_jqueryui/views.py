import json

from django.apps import apps
from django.http import HttpResponse
from django.utils.datastructures import MultiValueDictKeyError

TAGGIT_AUTOCOMPLETE_TAG_MODEL = 'taggit.Tag'


def tag_list_view(request):
    app_label, model_class = TAGGIT_AUTOCOMPLETE_TAG_MODEL.split('.')
    Tag = apps.get_model(app_label, model_class)
    try:
        tags = (Tag.objects.
                filter(name__istartswith=request.GET['term']).
                values_list('name', flat=True))
    except MultiValueDictKeyError:
        tags = []
    return HttpResponse(json.dumps(list(tags), ensure_ascii=False),
                        content_type='application/json')
