# throttling.py
from rest_framework.throttling import UserRateThrottle


class CognitoUserRateThrottle(UserRateThrottle):
    def allow_request(self, request, view):
        self.user = request.user
        self.auth = request.auth
        return super().allow_request(request, view)

    def get_cache_key(self, request, view):
        if not request.user.is_authenticated:
            ident = self.get_ident(request)
        else:
            ident = request.user.pk  # or request.user.username

        return self.cache_format % {
            'scope': self.scope,
            'ident': ident
        }

    def get_rate(self):
        if not hasattr(self, 'user') or not self.user.is_authenticated:
            return None

        token_info = self.auth

        # Example: Apply different throttle rates based on the user's role
        if 'Free' in token_info.get('custom:plan', ''):
            return '3/day'
        elif 'Paid' in token_info.get('custom:plan', ''):
            return '100/day'
        else:
            return '0/day'
