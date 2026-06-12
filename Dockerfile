FROM node:20-alpine
WORKDIR /app
RUN npm install -g tsx
COPY . .
CMD ["tsx", "watch", "web/index.js"]