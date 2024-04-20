from django.urls import path
import api.views as views

urlpatterns = [
    path("users/", views.UserList.as_view()),
    path("users/<int:id>", views.UserDetail.as_view()),
    path("users/<int:id>/pfp", views.update_pfp),
    path("users/<int:id>/banner", views.update_banner),
    path("users/<int:id>/follows/", views.follow_list),
    path("tweets/", views.tweet_list),
    path("tweets/<int:id>/", views.tweet_details),
    path("tweets/<int:id>/like/", views.LikesList.as_view()),
    path("tweets/<int:id>/comments/", views.CommentList.as_view()),
    path("comments/<int:id>/", views.CommentDetails.as_view()),
]
