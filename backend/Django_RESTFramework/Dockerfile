FROM python:3.12

ENV TZ "Asia/Tokyo"

WORKDIR /usr/src/app

ARG DJANGO_SUPERUSER_USERNAME
ENV DJANGO_SUPERUSER_USERNAME=${DJANGO_SUPERUSER_USERNAME}
ARG DJANGO_SUPERUSER_EMAIL
ENV DJANGO_SUPERUSER_EMAIL=${DJANGO_SUPERUSER_EMAIL}
ARG DJANGO_SUPERUSER_PASSWORD
ENV DJANGO_SUPERUSER_PASSWORD=${DJANGO_SUPERUSER_PASSWORD}

COPY . .

RUN pip install --no-cache-dir -r requirements.txt
RUN poetry install

WORKDIR /usr/src/app/Foundation_Building

EXPOSE 8081

ENV PORT 8081
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

CMD sh -c "poetry run python manage.py migrate && poetry run python manage.py createsuperuser --noinput ; poetry run python manage.py runserver 0.0.0.0:8081"
