FROM nginx

MAINTAINER Commande-Online.fr SAS

# Install curl
RUN apt-get update && \
    apt-get install -y \
        curl \
        git

# Install Node
ENV NPM_CONFIG_LOGLEVEL info
ENV NODE_VERSION 5.3.0

RUN curl -SLO "https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.gz" \
  && tar -xzf "node-v$NODE_VERSION-linux-x64.tar.gz" -C /usr/local --strip-components=1 \
  && rm "node-v$NODE_VERSION-linux-x64.tar.gz"


#RUN curl -sL https://deb.nodesource.com/setup_4.x | -E bash - ;
#RUN apt-get update && \
#    apt-get install -y \
#        nodejs

# Install Bower
RUN npm -y install -g bower

# Install Bower packages
COPY ./ /usr/share/nginx/html
#VOLUME ["/usr/share/nginx/html"]
WORKDIR /usr/share/nginx/html
RUN bower install --allow-root && \
    chown nginx:nginx -R *
