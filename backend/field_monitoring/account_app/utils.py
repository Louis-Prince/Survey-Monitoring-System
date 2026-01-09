from django.core.mail import send_mail


def send_credentials_email(user, password):
    send_mail(
        subject="Survey Monitoring System Access",
        message=(
            f"Hello,\n\n"
            f"Your account has been created.\n\n"
            f"Email: {user.email}\n"
            f"Password: {password}\n\n"
            f"You may login using this password.\n"
            f"You can optionally change your password after login.\n\n"
            f"Thank you."
        ),
        from_email="noreply@system.com",
        recipient_list=[user.email],
        fail_silently=False,
    )
