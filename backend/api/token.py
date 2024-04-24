import jwt


def get_token(request):
    if request.META.get("HTTP_AUTHORIZATION", "") == "":
        raise Exception("No token provided")

    token = request.META.get("HTTP_AUTHORIZATION", "").split(" ")[1]
    return token


def decode(token):
    payload = jwt.decode(token, options={"verify_signature": False})
    print(payload)
    return payload
