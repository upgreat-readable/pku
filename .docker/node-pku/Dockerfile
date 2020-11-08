FROM node:12.16.3-stretch

ENV LOCALTIME Europe/Moscow

RUN set -ex && \
	mkdir -p /app/node_modules /app/build /app/files /app/logs && \
	mkdir /files && \
	chown node:node /files

RUN echo '192.168.1.53 ds.readable.192.168.1.53.nip.io' >> /etc/hosts

COPY .docker/entrypoint.sh /entrypoint.sh
COPY node_modules /app/node_modules
COPY build /app/build

RUN chown -R node:node /app

ENV NPM_CONFIG_LOGLEVEL warn
ARG UID
ARG GID
RUN usermod --non-unique --uid ${UID} node
RUN groupmod -g ${GID} node

USER node

WORKDIR /app

ENTRYPOINT ["/usr/local/bin/node"]
