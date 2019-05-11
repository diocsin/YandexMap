FROM node:10

LABEL MAINTAINER="Siarhei Sivazhalezau <sz@isida.by>"

RUN apt-get update && apt-get install -y openjdk-8-jdk unzip locales && rm -rf /var/lib/apt/lists/*

RUN localedef -i en_US -c -f UTF-8 -A /usr/share/locale/locale.alias en_US.UTF-8

RUN curl -sS http://cdn.sencha.com/cmd/6.7.0.63/no-jre/SenchaCmd-6.7.0.63-linux-amd64.sh.zip > /tmp/sencha.zip \
    && unzip /tmp/sencha.zip -d /tmp \
    && /tmp/SenchaCmd*.sh -q -dir /opt/Sencha/Cmd/6.7.0.63 -Dall=true

ENV LANG en_US.UTF-8
ENV LC_ALL en_US.UTF-8

ENTRYPOINT ["/opt/Sencha/Cmd/6.7.0.63/sencha"]

WORKDIR /code