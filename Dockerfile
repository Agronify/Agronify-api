FROM node:18-buster-slim
COPY . /app
WORKDIR /app
RUN apt update
ENV PYTHONUNBUFFERED=1
RUN apt install -y python3 python3-pip && ln -sf python3 /usr/bin/python
RUN pip3 install --no-cache --upgrade pip setuptools
RUN pip3 install tensorflowjs tensorflow