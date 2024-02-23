FROM python:3.10

WORKDIR /usr/src/app

COPY ./requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY ./Foundation_Building/Foundation_Building ./Foundation_Building
COPY ./Foundation_Building/mini_aws ./mini_aws
COPY ./Foundation_Building/manage.py .

EXPOSE 8081

ENV PORT 8081
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

CMD ["python", "manage.py", "runserver", "0.0.0.0:8081"]
