from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    pfp = models.CharField()
    bio = models.TextField()

    class Meta:
        app_label = "api"


class Tweet(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.Cascade)
    content = models.TextField()
    created_at = models.DateTimeField()

    class Meta:
        app_label = "api"


class Comment(models.Model):
    tweet_id = models.ForeignKey(Tweet, on_delete=models.Cascade)
    user_id = models.ForeignKey(User, on_delete=models.Cascade)
    content = models.TextField()
    created_at = models.DateTimeField()

    class Meta:
        app_label = "api"


class Like(models.Model):
    post_id = models.ForeignKey(Tweet, on_delete=models.Cascade)
    user_id = models.ForeignKey(User, on_delete=models.Cascade)

    class Meta:
        app_label = "api"
        unique_together = ["tweet_id", "user_id"]


class Followers(models.Model):
    followed_id = models.ForeignKey(User, on_delete=models.CASCADE)
    follower_id = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        app_label = "api"
        unique_together = ["followed_id", "follower_id"]
