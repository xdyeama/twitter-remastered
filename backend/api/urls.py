from django.urls import path
import api.views as views

urlpatterns = [
    path("users/", views.UserList.as_view()),
    path("users/<int:id>", views.UserDetail.as_view()),
    path("users/<int:id>/pfp", views.update_pfp),
]
