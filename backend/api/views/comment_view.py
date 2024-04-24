from rest_framework.views import APIView
from api.models import Tweet, Comment
from api.serializers import TweetSerializer, CommentsSerializer
from rest_framework.response import Response
from rest_framework import status
import api.token as token
import jwt


class CommentList(APIView):
    def get(self, request, id):
        try:
            tweet = Tweet.objects.get(id=id)
        except Tweet.DoesNotExist as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        comments = Comment.objects.filter(tweet_id=tweet).order_by("-created_at")
        serializer = CommentsSerializer(comments, many=True)
        return Response(serializer.data)

    def post(self, request, id):
        try:
            jwt_token = token.get_token(request=request)
            payload = token.decode(jwt_token)
            tweet = Tweet.objects.get(id=id)
        except Tweet.DoesNotExist as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
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

        request_data = {
            "tweet_id": id,
            "user_id": payload["user_id"],
            "content": request.data["content"],
        }
        serializer = CommentsSerializer(data=request_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CommentDetails(APIView):
    def get(self, request, id):
        try:
            comment = Comment.objects.get(id=id)
            serializer = CommentsSerializer(comment)
            return Response(serializer.data)
        except Comment.DoesNotExist as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        comment = Comment.objects.get(id=id)
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
        print(comment.user_id, payload["username"])
        if str(comment.user_id) != (payload["username"]):
            return Response(
                {"error": "access denied"}, status=status.HTTP_403_FORBIDDEN
            )
        comment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
