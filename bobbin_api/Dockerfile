# FROM ruby:3.2.3
FROM ruby:3.2.3-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    libvips \
    libvips-tools \
    poppler-utils \
    default-libmysqlclient-dev \
    && rm -rf /var/lib/apt/lists/*

ENV RAILS_ENV="development"

COPY Gemfile Gemfile.lock ./

RUN bundle install

COPY . .

EXPOSE 3001

CMD ["rails", "server", "-b", "0.0.0.0"]