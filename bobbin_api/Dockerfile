# syntax=docker/dockerfile:1

ARG RUBY_VERSION=3.2.3
FROM ruby:$RUBY_VERSION-slim

# libmysqlclient-dev: MySQLのgem 'mysql2' のコンパイルに必要
# nodejs: RailsのJavaScriptランタイムとWebpackerサポートに必要
RUN apt-get update -qq && apt-get install -y nodejs libmysqlclient-dev

WORKDIR /app

COPY Gemfile Gemfile.lock ./

ENV RAILS_ENV="development"

RUN bundle config set --local path 'vendor/bundle' && \
    bundle install && \
    rm -rf ~/.bundle/ "${BUNDLE_PATH}"/ruby/*/cache "${BUNDLE_PATH}"/ruby/*/bundler/gems/*/.git && \
    bundle exec bootsnap precompile --gemfile

COPY . .

EXPOSE 3000

CMD ["rails", "server", "-b", "0.0.0.0"]