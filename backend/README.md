
# Twitter remastered - Backend

Backend done on Django


## Models

| Model | Serializer     | View type               |
| :-------- | :------- | :------------------------- |
| User (django) | `.ModelSerializer` | `cbv` |
| Profile | `.ModelSerializer` | `cbv`, `fbv` |
| Tweet | `.ModelSerializer` | `fbv` |
| Comment | `.Serializer` | `cbv` |
| Like | `.Serializer` | `cbv` |
| Followers | `.Serializer` | `fbv` |

## API Reference

* [Users](#Users)
* [Followers](#Followers)
* [Tweets](#Tweets)
* [Likes](#Likes)
* [Comments](#Comments)

# Users

### Get all users

```http
  GET /api/users
```

### Create new user

```http
  POST /api/users
```
Request body example:
```
{
    "username": "...", 
    "email": "...",
    "password": "...",
    "profile": {
        "name": "...", //optional
        "bio": "..."   //optional
    }
}
```

### Get user details

```http
  GET /api/users/${username}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `username`      | `string` | **Required**. Id of item to fetch |

Response example
```
{
    "id": 10,
    "username": "uldanone",
    "email": "uldanone@kbtu.kz",
    "profile": {
        "name": "user",
        "pfp": "/media/profile_pictures/anonym.png",
        "banner": "/media/banners/default.jpg",
        "bio": "hello :)"
    }
}
```
### Patch user details

```http
  PATCH /api/users/${username}
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `username`      | `string` | **Required**. Id of item to fetch |

Request body example - all fields are optional
```
{
    "password": "12345password",
    "profile": {
        "name": "new name",
        "bio": "new bio"
    }
}
```

### Delete user

```http
  DELETE /api/users/${username}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `username`      | `string` | **Required**. Id of item to fetch |


### Update profile pic

```http
  PATCH /api/users/${username}/pfp
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `username`      | `string` | **Required**. Id of item to fetch |

| Body Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `pfp`      | `file` | **Required**. new pfp|

### Update profile banner

```http
  PATCH /api/users/${username}/banner
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `username`      | `string` | **Required**. Id of item to fetch |

| Body Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `banner`      | `file` | **Required**. new banner|

# Followers

### Get followers and followings

```http
  GET /api/users/${username}/follows
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `username`      | `string` | **Required**. Id of item to fetch |

Response body example
```
{
    "followed": [
        {
            "id": ...,
            "username": "...",
            "email": "...",
            "profile": {
               ...
            }
        },
        ...
    ],
    "followers": [
        {
            "id": ...,
            "username": "...",
            "email": "...",
            "profile": {
               ...
            }
        },
        ...
    ]
}
```

### Follow someone

```http
  POST /api/users/${username}/follows
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `username`      | `string` | **Required**. Id of item to fetch |

Request body example - temporary solution
```
{
    "follower_id": ...
}
```
**Result**: `follower_id` now follows `id`

### Unfollow someone

```http
  DELETE /api/users/${username}/follows
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `username`      | `string` | **Required**. Id of item to fetch |

Request body example - temporary solution
```
{
    "follower_id": ...
}
```
**Result**: `follower_id` now dont follow `id`

# Tweets

### Get all tweets

```http
  GET /api/tweets/
```

### Post new tweet

```http
  POST /api/tweets/
```

Request body example 
```
{
    "user_id": 5,
    "content": "do you know what my fav ramen is?"
}
```
### Get tweet details

```http
  GET /api/tweets/${id}
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `int` | **Required**. Id of item to fetch |

Response body example 
```
{
    "id": 1,
    "user_id": 5,
    "user": {
        "id": ...,
        "username": "...",
        "email": "...",
        "profile": {
            ...
        }
    },
    "content": "have a great day yall",
    "created_at": "2024-04-17T08:49:50.612812Z",
    "comments_count": 1,
    "likes_count": 0
}
```

### Delete tweet

```http
  DELETE /api/tweets/${id}
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `int` | **Required**. Id of item to fetch |

# Likes

### Get list of users who liked this tweet

```http
  GET /api/tweets/${id}/like
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `int` | **Required**. Id of item to fetch |

Response body example 
```
[
    {
        "id": 2,
        "user": {
            "id": ...,
            "username": "...",
            "email": "...",
            "profile": {
                ...
            }
        }
    },
    ...
]
```

### Like a tweet

```http
  POST /api/users/${id}/like
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `int` | **Required**. Id of item to fetch |

Request body example - temporary solution
```
{
    "user_id": ...
}
```
**Result**: `user_id` liked `id` tweet

### Unlike a tweet

```http
  DELETE /api/users/${id}/like
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `int` | **Required**. Id of item to fetch |

Request body example - temporary solution
```
{
    "user_id": ...
}
```
**Result**: `user_id` unliked `id` tweet

# Comment

### Get all comments under tweet

```http
  GET /api/users/${id}/comments
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `int` | **Required**. Id of item to fetch |

Response body example 
```
[
    {
        "id": ...,
        "tweet_id": ...,
        "user_id": ...,
        "user": {
            "id": ...,
            "username": "...",
            "email": "...",
            "profile": {
                ...
            }
        },
        "content": "this is very good post",
        "created_at": "2024-04-17T14:40:51.444335Z"
    },
    ...
]
```


### Post a comment under tweet

```http
  POST /api/users/${id}/comments
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `int` | **Required**. Id of item to fetch |

Request body example - temporary solution
```
{
    "user_id" : 5,
    "content": "this is very good post"
}
```

### Get comment by id

```http
  GET /api/comments/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `int` | **Required**. Id of item to fetch |

Response body example
```
{
    "id": ...,
    "tweet_id": ...,
    "user_id": ...,
    "user": {
        "id": ...,
        "username": "...",
        "email": "...",
        "profile": {
            ...
        }
    },
    "content": "this is very good post",
    "created_at": "2024-04-17T14:40:51.444335Z"
}
```

### Delete comment 

```http
  DELETE /api/comments/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `int` | **Required**. Id of item to fetch |



