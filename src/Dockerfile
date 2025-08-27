FROM node:20-alpine

WORKDIR /app
COPY ../package*.json ./
COPY package.json ./
RUN npm install --workspace ./ 

COPY . .
COPY icons/ ./icons/

EXPOSE 5173
CMD ["npm", "run", "dev"]