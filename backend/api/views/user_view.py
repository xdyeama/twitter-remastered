from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from api.models import Profile
from api.serializers import UserSerializer, ProfileSerializer


class UserList(APIView):
    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserDetail(APIView):
    def get(self, request, username):
        try:
            user = User.objects.get(username=username)
            serializer = UserSerializer(user)
            return Response(serializer.data)
        except User.DoesNotExist as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, username):
        try:
            user = User.objects.get(username=username)
            serializer = UserSerializer(user, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, username):
        user = User.objects.get(username=username)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["PATCH"])
def update_pfp(request, username):
    user = User.objects.get(username=username)
    profile = Profile.objects.get(user_id=user.id)

    if "pfp" not in request.FILES:
        return Response({"error": "No file provided"}, status=400)

    pfp_file = request.FILES["pfp"]

    # Update profile picture
    profile.pfp = pfp_file
    profile.save()

    serializer = ProfileSerializer(profile)
    return Response(serializer.data)


@api_view(["PATCH"])
def update_banner(request, username):
    user = User.objects.get(username=username)
    profile = Profile.objects.get(user_id=user.id)

    if "banner" not in request.FILES:
        return Response({"error": "No file provided"}, status=400)

    banner_file = request.FILES["banner"]

    # Update profile picture
    profile.banner = banner_file
    profile.save()

    serializer = ProfileSerializer(profile)
    return Response(serializer.data)
