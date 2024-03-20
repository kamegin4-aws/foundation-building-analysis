FROM python:3.10

WORKDIR /usr/src/app

COPY ./requirements.txt .
COPY ./pyproject.toml .
COPY ./Foundation_Building/Foundation_Building ./Foundation_Building
COPY ./Foundation_Building/library ./library
COPY ./Foundation_Building/mini_aws ./mini_aws
COPY ./Foundation_Building/manage.py .
COPY ./Foundation_Building/global-bundle.pem .
COPY ./Foundation_Building/.env .

RUN pip install --no-cache-dir -r requirements.txt
RUN poetry install

ARG DJANGO_SUPERUSER_USERNAME
ENV DJANGO_SUPERUSER_USERNAME=${DJANGO_SUPERUSER_USERNAME}
ARG DJANGO_SUPERUSER_EMAIL
ENV DJANGO_SUPERUSER_EMAIL=${DJANGO_SUPERUSER_EMAIL}
ARG DJANGO_SUPERUSER_PASSWORD
ENV DJANGO_SUPERUSER_PASSWORD=${DJANGO_SUPERUSER_PASSWORD}

EXPOSE 8081

ENV PORT 8081
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

CMD sh -c "poetry run python manage.py migrate && poetry run python manage.py createsuperuser --noinput ; poetry run python manage.py runserver 0.0.0.0:8081"
