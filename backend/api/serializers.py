from rest_framework import serializers
from api.models import Profile, Tweet, Like, Followers, Comment
from django.contrib.auth.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ["name", "pfp", "banner", "bio"]


class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(required=False)
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "password", "profile"]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance:  # If instance exists, it's an update
            self.fields["username"].read_only = True
            self.fields["email"].read_only = True
            self.fields["password"].required = False
        else:  # It's a create operation
            self.fields["username"].required = True
            self.fields["email"].required = True

    def create(self, validated_data):
        profile_data = validated_data.pop("profile", {})
        password = validated_data.pop("password", "")
        user = User.objects.create_user(**validated_data, password=password)
        Profile.objects.create(user=user, **profile_data)
        return user

    def update(self, instance, validated_data):
        profile_data = validated_data.pop("profile", {})
        password = validated_data.pop("password", None)

        if password:
            instance.set_password(password)
        instance.save()

        # Update profile using validated profile data
        profile = instance.profile
        profile.name = profile_data.get("name", profile.name)
        profile.bio = profile_data.get("bio", profile.bio)
        profile.save()

        return instance


class LikeSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    tweet_id = serializers.PrimaryKeyRelatedField(
        queryset=Tweet.objects.all(), write_only=True
    )
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), write_only=True
    )
    user = UserSerializer(source="user_id", read_only=True)

    def create(self, validated_data):
        return Like.objects.create(**validated_data)


class TweetSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    user = UserSerializer(source="user_id", read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    comments_count = serializers.SerializerMethodField()
    likes_count = serializers.SerializerMethodField()

    class Meta:
        model = Tweet
        fields = [
            "id",
            "user_id",
            "user",
            "content",
            "created_at",
            "comments_count",
            "likes_count",
        ]

    def get_comments_count(self, obj):
        return obj.comment_set.count()

    def get_likes_count(self, obj):
        return obj.like_set.count()

    def create(self, validated_data):
        return Tweet.objects.create(**validated_data)


class FollowersSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    followed_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), required=False, write_only=True
    )
    follower_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), required=False, write_only=True
    )
    followed = UserSerializer(source="followed_id", read_only=True)
    follower = UserSerializer(source="follower_id", read_only=True)

    def create(self, validated_data):
        return Followers.objects.create(**validated_data)

    def validate(self, data):
        if data.get("followed_id") == data.get("follower_id"):
            raise serializers.ValidationError(
                "Followed user and follower cannot be the same."
            )
        return data


class CommentsSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    tweet_id = serializers.PrimaryKeyRelatedField(queryset=Tweet.objects.all())
    user_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    user = UserSerializer(source="user_id", read_only=True)
    content = serializers.CharField()
    created_at = serializers.DateTimeField(read_only=True)

    def create(self, validated_data):
        return Comment.objects.create(**validated_data)


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token["username"] = user.username
        token["email"] = user.email
        return token
