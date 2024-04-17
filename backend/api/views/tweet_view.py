from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from api.models import Tweet
from api.serializers import TweetSerializer


@api_view(["GET", "POST"])
def tweet_list(request):
    if request.method == "GET":
        tweets = Tweet.objects.order_by("-created_at")
        serializer = TweetSerializer(tweets, many=True)
        return Response(serializer.data)
    if request.method == "POST":
        serializer = TweetSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "DELETE"])
def tweet_details(request, id):
    try:
        tweet = Tweet.objects.get(id=id)
    except Tweet.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if request.method == "GET":
        serializer = TweetSerializer(tweet)
        return Response(serializer.data)
    if request.method == "DELETE":
        tweet.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
