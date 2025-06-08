FROM python:3.11-slim

RUN apt-get update \
    && apt-get install -y build-essential gcc libpq-dev \
    && pip install --no-cache-dir poetry==2.1.2 

WORKDIR /app

COPY pyproject.toml poetry.lock ./

RUN poetry config virtualenvs.create false \
    && poetry install --no-interaction --no-ansi --no-root

COPY . .

RUN python manage.py collectstatic --noinput

RUN apt-get remove -y gcc libpq-dev build-essential \
    && apt-get autoremove -y && apt-get clean