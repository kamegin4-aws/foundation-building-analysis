#!/bin/bash

gnome-terminal --window --title="hextjs" -- bash -c "docker logs -f next_js; bash"

gnome-terminal --window --title="django-rest" -- bash -c "docker logs -f django_rf; bash"
