FROM node:10

LABEL MAINTAINER="Siarhei Sivazhalezau <sz@isida.by>"

RUN apt-get update && apt-get install -y openjdk-8-jdk unzip

RUN curl -sS http://cdn.sencha.com/cmd/6.6.0.13/no-jre/SenchaCmd-6.6.0.13-linux-amd64.sh.zip > /tmp/sencha.zip \
    && unzip /tmp/sencha.zip -d /tmp \
    && /tmp/SenchaCmd*.sh -q -dir /opt/Sencha/Cmd/6.6.0.13 -Dall=true

ENV LC_ALL en_US.UTF-8
ENV LANG en_US.UTF-8

ENTRYPOINT ["/opt/Sencha/Cmd/6.6.0.13/sencha"]

WORKDIR /code
