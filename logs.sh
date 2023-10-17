#!/bin/bash

gnome-terminal --window --title="hextjs" -- bash -c "docker logs -f nextjs; bash"

gnome-terminal --window --title="django-rest" -- bash -c "docker logs -f django-rest; bash"