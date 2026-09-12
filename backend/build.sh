#!/usr/bin/env bash
set -o errexit

pip install -r requirements.txt

# Remove any existing static folder from previous failed build attempts
rm -rf staticfiles

python manage.py collectstatic --no-input --clear
python manage.py migrate