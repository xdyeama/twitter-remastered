from django.contrib import admin
from .models import Profile, Tweet, Comment, Like, Followers

# Register your models here.
admin.site.register(Profile)
admin.site.register(Tweet)
admin.site.register(Comment)
admin.site.register(Like)
admin.site.register(Followers)
