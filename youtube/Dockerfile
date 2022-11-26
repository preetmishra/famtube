FROM python:3.8

WORKDIR /app

# Install dependencies.
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy files (other than whatever is in .dockerignore) to the working directory.
COPY . ./

CMD [ "python", "./src/scheduler.py" ]
