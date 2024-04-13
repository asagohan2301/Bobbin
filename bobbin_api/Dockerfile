# ベースステージ
FROM ruby:3.2.3-slim as base
WORKDIR /app
RUN apt-get update && apt-get install -y \
    build-essential \
    libvips \
    libvips-tools \
    poppler-utils \
    default-libmysqlclient-dev \
    && rm -rf /var/lib/apt/lists/*
COPY Gemfile Gemfile.lock ./
EXPOSE 3001

# 開発環境用のビルドステージ
FROM base as development
RUN bundle install
COPY . .

# 本番環境用のビルドステージ
FROM base as production
RUN bundle install --without development test
COPY . .
CMD ["bundle", "exec", "puma", "-C", "config/puma.rb"]
