from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from api.models import Followers, User
from api.serializers import FollowersSerializer


@api_view(["GET", "POST", "DELETE"])
def follow_list(request, id):
    try:
        user = User.objects.get(id=id)
    except User.DoesNotExist as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    if request.method == "GET":
        followers = Followers.objects.filter(followed_id=id)
        followed = Followers.objects.filter(follower_id=id)
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
    if request.method == "POST":
        request_data = request.data
        request_data["followed_id"] = id
        serializer = FollowersSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    if request.method == "DELETE":
        try:
            following = Followers.objects.get(
                followed_id=id, follower_id=request.data["follower_id"]
            )
            following.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Followers.DoesNotExist as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
