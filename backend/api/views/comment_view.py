from rest_framework.views import APIView
from api.models import Tweet, Comment
from api.serializers import TweetSerializer, CommentsSerializer
from rest_framework.response import Response
from rest_framework import status


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
            tweet = Tweet.objects.get(id=id)
        except Tweet.DoesNotExist as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        request_data = request.data
        request_data["tweet_id"] = id
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
        comment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
