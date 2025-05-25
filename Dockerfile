# Usamos la imagen oficial de Node.js
FROM node:18

# Configuración del directorio de trabajo
WORKDIR /app

# Copiamos los archivos del backend al contenedor
COPY package.json package-lock.json ./
RUN npm install

# Copiamos el resto de los archivos
COPY . .

# Exponemos el puerto del backend
EXPOSE 3000

# Comando para iniciar el backend
CMD ["node", "index.js"]
