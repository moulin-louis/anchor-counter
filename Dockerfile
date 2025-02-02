# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

ARG NODE_VERSION=22.11.0

FROM node:${NODE_VERSION}-alpine

# Use production node environment by default.
ENV NODE_ENV=production

RUN apk add --no-cache python3 alpine-sdk linux-headers eudev-dev

WORKDIR /usr/src/app

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.yarn to speed up subsequent builds.
# Leverage a bind mounts to package.json and yarn.lock to avoid having to copy them into
# into this layer.
RUN --mount=type=bind,source=./app/package.json,target=package.json \
    --mount=type=bind,source=./app/yarn.lock,target=yarn.lock \
    --mount=type=cache,target=/root/.yarn \
    yarn install  --frozen-lockfile 


# Copy the rest of the source files into the image.
COPY ./app/ .


RUN yarn vite build

# Run the application.
CMD ["yarn", "preview", "--port", "3000", "--host" ]
