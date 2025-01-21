FROM php:8.3-cli
RUN apt-get update && apt-get install -y git zip unzip curl
RUN git config --global --add safe.directory '*'
COPY --from=composer /usr/bin/composer /usr/bin/composer
