from rest_framework import serializers
from api.models import User, Tweet, Like, Followers, Comment


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "first_name", "last_name", "email", "pfp", "bio"]


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
