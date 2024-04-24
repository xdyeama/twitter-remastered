from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from api.models import Profile
from api.serializers import (
    UserSerializer,
    ProfileSerializer,
    MyTokenObtainPairSerializer,
)
from rest_framework_simplejwt.views import TokenObtainPairView
import api.token as token
import jwt


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
            jwt_token = token.get_token(request=request)
            payload = token.decode(jwt_token)
            if payload["user_id"] != user.id:
                return Response(
                    {"error": "access denied"}, status=status.HTTP_403_FORBIDDEN
                )
            serializer = UserSerializer(user, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except jwt.ExpiredSignatureError:
            return Response(
                {"error": "jwt token has expired"}, status=status.HTTP_400_BAD_REQUEST
            )
        except jwt.InvalidTokenError:
            return Response(
                {"error": "invalid jwt token"}, status=status.HTTP_400_BAD_REQUEST
            )
        except User.DoesNotExist as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, username):
        try:
            user = User.objects.get(username=username)
            jwt_token = token.get_token(request=request)
            payload = token.decode(jwt_token)
            if payload["user_id"] != user.id:
                return Response(
                    {"error": "access denied"}, status=status.HTTP_403_FORBIDDEN
                )
            user.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
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


@api_view(["PATCH"])
def update_pfp(request, username):
    user = User.objects.get(username=username)
    try:
        jwt_token = token.get_token(request=request)
        payload = token.decode(jwt_token)
        if payload["user_id"] != user.id:
            return Response(
                {"error": "access denied"}, status=status.HTTP_403_FORBIDDEN
            )
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
    try:
        jwt_token = token.get_token(request=request)
        payload = token.decode(jwt_token)
        if payload["user_id"] != user.id:
            return Response(
                {"error": "access denied"}, status=status.HTTP_403_FORBIDDEN
            )
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
    profile = Profile.objects.get(user_id=user.id)

    if "banner" not in request.FILES:
        return Response({"error": "No file provided"}, status=400)

    banner_file = request.FILES["banner"]

    # Update profile picture
    profile.banner = banner_file
    profile.save()

    serializer = ProfileSerializer(profile)
    return Response(serializer.data)


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(["GET"])
def get_current_user(request):
    try:
        jwt_token = token.get_token(request=request)
        payload = token.decode(jwt_token)
        user = User.objects.get(id=payload["user_id"])
        serializer = UserSerializer(user)
        return Response(serializer.data)
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
