FROM node:24.14.1-slim AS build


ARG npmUri=$npmUri
ARG npmAuthToken=$npmAuthToken

ARG IMAGE_TAG
ENV VITE_IMAGE_TAG=$IMAGE_TAG


COPY . /build
WORKDIR /build

# Create temporary .npmrc in home directory (for Codefresh)
RUN echo "always-auth=true\nregistry=\"https://${npmUri}/\"\n//${npmUri}/:_authToken=${npmAuthToken}" > ./.npmrc
# RUN yarn install --frozen-lockfile --silent --production
# RUN cp -R node_modules prod_node_modules
RUN yarn install --frozen-lockfile --silent
RUN rm ./.npmrc

RUN yarn run webpack

FROM nginx AS release
COPY --from=build /build/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /build/dist /usr/share/nginx/html
EXPOSE 80