from django.contrib.auth.hashers import check_password
from django.core.cache import cache
from django.test import RequestFactory
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import PhoneOTP, User
from shared.middleware import ApiLanguageMiddleware


class PasswordlessAuthenticationTests(APITestCase):
    phone = '01712345678'

    def setUp(self):
        cache.clear()

    def request_otp(self, purpose='register'):
        if purpose == 'register':
            return self.client.post(reverse('accounts:register'), {
                'phone_number': self.phone,
                'full_name': 'রাইসা রহমান',
                'address': 'ঢাকা',
            }, format='json')
        payload = {'phone_number': self.phone}
        return self.client.post(reverse('accounts:otp-request'), payload, format='json')

    def test_register_verify_and_access_profile(self):
        response = self.request_otp()
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        otp = PhoneOTP.objects.get()
        self.assertNotEqual(otp.code_hash, '123456')
        self.assertTrue(check_password('123456', otp.code_hash))

        response = self.client.post(reverse('accounts:otp-verify'), {
            'phone_number': self.phone,
            'purpose': 'register',
            'code': '123456',
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertNotIn('refresh', response.data)
        self.assertIn('shikhon_refresh', response.cookies)
        self.assertTrue(response.cookies['shikhon_refresh']['httponly'])
        user = User.objects.get()
        self.assertEqual(user.phone_number, '+8801712345678')
        self.assertEqual(user.address, 'ঢাকা')
        self.assertEqual(user.role, User.Role.STUDENT)
        self.assertEqual(user.registration_details, {})

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {response.data['access']}")
        profile = self.client.get(reverse('accounts:me'))
        self.assertEqual(profile.status_code, status.HTTP_200_OK)
        self.assertEqual(profile.data['full_name'], 'রাইসা রহমান')

        self.client.credentials()
        refresh = self.client.post(reverse('accounts:token-refresh'), format='json')
        self.assertEqual(refresh.status_code, status.HTTP_200_OK)
        self.assertIn('access', refresh.data)
        self.assertIn('shikhon_refresh', refresh.cookies)

    def test_wrong_otp_is_rejected_and_counted(self):
        self.request_otp()
        response = self.client.post(reverse('accounts:otp-verify'), {
            'phone_number': self.phone,
            'purpose': 'register',
            'code': '000000',
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(PhoneOTP.objects.get().attempts, 1)

    def test_login_requires_an_existing_account(self):
        response = self.request_otp('login')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_api_messages_default_to_bangla(self):
        response = self.client.post(reverse('accounts:otp-request'), {
            'phone_number': self.phone,
        }, format='json')
        self.assertEqual(response.data['phone_number'][0], 'এই নম্বরে কোনো অ্যাকাউন্ট পাওয়া যায়নি।')

    def test_api_messages_can_be_requested_in_english(self):
        response = self.client.post(f"{reverse('accounts:otp-request')}?lang=eng", {
            'phone_number': self.phone,
        }, format='json')
        self.assertEqual(response.data['phone_number'][0], 'No account was found with this number.')

    def test_invalid_language_falls_back_to_bangla(self):
        response = self.client.post(f"{reverse('accounts:token-refresh')}?lang=fr", format='json')
        self.assertEqual(response.data['detail'], 'রিফ্রেশ টোকেন কুকি পাওয়া যায়নি।')

    def test_middleware_exposes_normalized_request_language(self):
        captured = {}

        def get_response(request):
            captured['lang'] = request.lang

        middleware = ApiLanguageMiddleware(get_response)
        middleware(RequestFactory().get('/api/example?lang=eng'))
        self.assertEqual(captured['lang'], 'en')

        middleware(RequestFactory().get('/api/example'))
        self.assertEqual(captured['lang'], 'ban')

    def test_refresh_requires_the_httponly_cookie(self):
        response = self.client.post(reverse('accounts:token-refresh'), format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_registration_resend_preserves_pending_profile(self):
        self.request_otp()
        response = self.client.post(reverse('accounts:register'), {
            'phone_number': self.phone,
            'full_name': 'রাইসা রহমান',
            'address': 'ঢাকা',
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        response = self.client.post(reverse('accounts:otp-verify'), {
            'phone_number': self.phone,
            'purpose': 'register',
            'code': '123456',
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(User.objects.get().full_name, 'রাইসা রহমান')

    def test_user_cannot_change_own_role(self):
        user = User.objects.create_user(
            phone_number=self.phone,
            full_name='Test Student',
            is_phone_verified=True,
        )
        self.client.force_authenticate(user)

        response = self.client.patch(reverse('accounts:me'), {'role': 'admin'}, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        user.refresh_from_db()
        self.assertEqual(user.role, User.Role.STUDENT)
