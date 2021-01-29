FROM node
LABEL weilan weilan<https://github.com/hql7>
WORKDIR /usr/local/server
ENV TZ Asia/Shanghai
ARG registry=https://registry.npm.taobao.org
ARG disturl=https://npm.taobao.org/dist
RUN yarn config set disturl $disturl
RUN yarn config set registry $registry
COPY package.json .
RUN yarn --frozen-lockfile --production
COPY . .
EXPOSE 3700
CMD [ "yarn", "start" ]
