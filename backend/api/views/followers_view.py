from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from api.models import Followers, User
from api.serializers import FollowersSerializer
import api.token as token
import jwt


@api_view(["GET", "POST", "DELETE"])
def follow_list(request, username):
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    if request.method == "GET":
        followers = Followers.objects.filter(followed_id=user.id)
        followed = Followers.objects.filter(follower_id=user.id)
        followers_serializer = FollowersSerializer(followers, many=True)
        followed_serializer = FollowersSerializer(followed, many=True)

        followers_data = [
            follower["follower"] for follower in followers_serializer.data
        ]
        followed_data = [
            followed_user["followed"] for followed_user in followed_serializer.data
        ]

        return Response(
            {
                "followed": followed_data,
                "followers": followers_data,
            }
        )
    try:
        jwt_token = token.get_token(request=request)
        payload = token.decode(jwt_token)
    except jwt.ExpiredSignatureError:
        return Response(
            {"error": "jwt token has expired"}, status=status.HTTP_400_BAD_REQUEST
        )
    except jwt.InvalidTokenError:
        return Response(
            {"error": "invalid jwt token"}, status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    if request.method == "POST":
        request_data = {"follower_id": payload["user_id"], "followed_id": user.id}
        serializer = FollowersSerializer(data=request_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    if request.method == "DELETE":
        try:
            following = Followers.objects.get(
                followed_id=user.id, follower_id=payload["user_id"]
            )
            following.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Followers.DoesNotExist:
            pass
