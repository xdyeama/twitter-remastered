from django.db import models
from django.contrib.auth.models import User


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.TextField(max_length=200, default="user")
    pfp = models.ImageField(
        null=True,
        upload_to="profile_pictures/",
        default="profile_pictures/anonym.png",
    )
    banner = models.ImageField(
        null=True,
        upload_to="banners/",
        default="banners/default.jpg",
    )
    bio = models.CharField(max_length=150)

    def __str__(self):
        return f"ID: { self.user.id}, Name: {self.user.username}"

    class Meta:
        app_label = "api"


class Tweet(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True, blank=True)

    class Meta:
        app_label = "api"


class Comment(models.Model):
    tweet_id = models.ForeignKey(Tweet, on_delete=models.CASCADE)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True, blank=True)

    class Meta:
        app_label = "api"


class Like(models.Model):
    tweet_id = models.ForeignKey(Tweet, on_delete=models.CASCADE)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        app_label = "api"
        unique_together = ["tweet_id", "user_id"]


class Followers(models.Model):
    followed_id = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="following_set"
    )
    follower_id = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="followers_set"
    )

    class Meta:
        app_label = "api"
        unique_together = ["followed_id", "follower_id"]
