FROM node:22-slim

COPY /app /app 
WORKDIR /app

RUN yarn install --frozen-lockfile

RUN yarn vite build

CMD ["yarn", "preview", "--port", "3000", "--host" ]
