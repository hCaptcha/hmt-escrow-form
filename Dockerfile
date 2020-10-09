FROM node:12

#set working directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Copy code over
COPY . /usr/src/app
RUN cd /usr/src/app
          
# Install Requirements
RUN yarn install

# Launch App
CMD yarn run start