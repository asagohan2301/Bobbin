#!/bin/bash
set -e
rails db:prepare
rails active_storage:install
rails db:migrate
exec "$@"