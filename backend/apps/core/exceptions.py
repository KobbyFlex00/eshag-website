from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status


def custom_api_exception_handler(exc, context):
    """
    Returns consistent, structured JSON responses for all REST exceptions.
    """
    response = exception_handler(exc, context)

    if response is not None:
        custom_data = {
            "success": False,
            "error": {
                "status_code": response.status_code,
                "type": exc.__class__.__name__,
                "detail": response.data if isinstance(response.data, (dict, list)) else str(response.data),
            }
        }
        return Response(custom_data, status=response.status_code)

    return response