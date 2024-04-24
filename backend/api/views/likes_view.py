from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response

from api.models import Like, Tweet
from api.serializers import LikeSerializer

import jwt
import api.token as tkn


class LikesList(APIView):
    def get(self, request, id):
        try:
            tweet = Tweet.objects.get(id=id)
        except Tweet.DoesNotExist as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        likes = Like.objects.filter(tweet_id=tweet.id)
        serializer = LikeSerializer(likes, many=True)
        return Response(serializer.data)

    def post(self, request, id):
        try:
            token = tkn.get_token(request=request)
            payload = tkn.decode(token)
            tweet = Tweet.objects.get(id=id)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except jwt.ExpiredSignatureError:
            return Response(
                {"error": "jwt token has expired"}, status=status.HTTP_400_BAD_REQUEST
            )
        except jwt.InvalidTokenError:
            return Response(
                {"error": "invalid jwt token"}, status=status.HTTP_400_BAD_REQUEST
            )
        except Tweet.DoesNotExist as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        request_data = {"tweet_id": tweet.id, "user_id": payload["user_id"]}
        serializer = LikeSerializer(data=request_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        try:
            token = tkn.get_token(request=request)
            payload = tkn.decode(token)
            like = Like.objects.get(tweet_id=id, user_id=payload["user_id"])
            like.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Like.DoesNotExist as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except jwt.ExpiredSignatureError:
            return Response(
                {"error": "jwt token has expired"}, status=status.HTTP_400_BAD_REQUEST
            )
        except jwt.InvalidTokenError:
            return Response(
                {"error": "invalid jwt token"}, status=status.HTTP_400_BAD_REQUEST
            )


class LikeDetail(APIView):
    def delete(self, request, id):
        try:
            like = Like.objects.get(id=id)
            like.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Like.DoesNotExist as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
