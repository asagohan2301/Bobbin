FROM ruby:3.2.3
ARG RUBY_VERSION=3.2.3

WORKDIR /app

COPY Gemfile Gemfile.lock ./

ENV RAILS_ENV="development"

RUN bundle install

COPY . .

EXPOSE 3001

CMD ["rails", "server", "-b", "0.0.0.0"]