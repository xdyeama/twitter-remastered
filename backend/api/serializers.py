from rest_framework import serializers
from api.models import Profile, Tweet, Like, Followers, Comment
from django.contrib.auth.models import User


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ["pfp", "bio"]


class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(required=False)
    password = serializers.CharField(write_only=True, required=False)
    username = serializers.CharField(required=False)

    class Meta:
        model = User
        fields = ["id", "username", "email", "password", "profile"]

    def create(self, validated_data):
        profile_data = validated_data.pop("profile", {})
        password = validated_data.pop("password")
        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()
        Profile.objects.create(user=user, **profile_data)
        return user

    def update(self, instance, validated_data):
        profile_data = validated_data.pop("profile", {})
        password = validated_data.pop("password", None)

        instance.username = validated_data.get("username", instance.username)
        instance.email = validated_data.get("email", instance.email)
        if password:
            instance.set_password(password)
        instance.save()

        profile = instance.profile
        profile.pfp = profile_data.get("pfp", profile.pfp)
        profile.bio = profile_data.get("bio", profile.bio)
        profile.save()

        return instance


class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ["id", "post_id", "user_id"]


class TweetSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    content = serializers.CharField()
    created_at = serializers.DateTimeField()

    def create(self, validated_data):
        return Tweet.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.user_id = validated_data.get("user_id", instance.user_id)
        instance.content = validated_data.get("content", instance.content)
        instance.created_at = validated_data.get("created_at", instance.created_at)
        instance.save()
        return instance


class FollowersSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    followed_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    follower_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())

    def create(self, validated_data):
        return Followers.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.followed_id = validated_data.get("followed_id", instance.followed_id)
        instance.follower_id = validated_data.get("follower_id", instance.follower_id)
        instance.save()
        return instance
