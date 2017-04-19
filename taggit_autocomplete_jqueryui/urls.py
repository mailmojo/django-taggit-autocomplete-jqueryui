# -*- coding: utf-8 -*-
from django.conf.urls import url

from taggit_autocomplete_jqueryui import views

urlpatterns = [
    url(r'^json$', views.tag_list_view,
        name='taggit_autocomplete_jqueryui_tag_list'),
]
