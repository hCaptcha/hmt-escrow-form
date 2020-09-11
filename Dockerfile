FROM python:3.7-buster

#set working directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Copy Shit over
COPY . /usr/src/app
RUN cd /usr/src/app
          
# Install Requirements
RUN pip install -r requirements.txt

# Export Environment Variables
ENV FLASK_APP=app.py
ENV HMT_API=http://127.0.0.1:8000/labeling-requests


# Run the flask Server & Mock API
# CMD ["flask", "run"] 

CMD ./run-server-and-api.sh