FROM python:3

WORKDIR /usr/src/app

COPY ${PWD}/requirements.txt ./

RUN pip install --no-cache-dir -r requirements.txt

#RUN python manage.py migrate

EXPOSE 8080

ENV PORT 8080
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

#CMD [ "python", "manage.py", "runserver" ]
