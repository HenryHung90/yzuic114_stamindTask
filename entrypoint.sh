#!/bin/sh

# Apply database migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser if it doesn't exist
if [ -n "$DJANGO_SUPERUSER_ID" ] && [ -n "$DJANGO_SUPERUSER_PASSWORD" ]; then
    echo "Creating superuser..."
    python manage.py shell <<EOF
    from django.contrib.auth import get_user_model
    User = get_user_model()
    if not User.objects.filter(student_id="$DJANGO_SUPERUSER_ID").exists():
    User.objects.create_superuser(
    student_id="$DJANGO_SUPERUSER_ID",
    password="$DJANGO_SUPERUSER_PASSWORD",
    name="admin",
    user_type=User.UserType.TEACHER
    )
    print("Superuser created.")
    else:
    print("Superuser already exists.")
EOF
else
echo "Superuser credentials not provided. Skipping superuser creation."
fi