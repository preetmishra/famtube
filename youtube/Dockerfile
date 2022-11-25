FROM python:3.8

WORKDIR /mnt/youtube

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY ./src ./src

CMD [ "python", "./src/scheduler.py" ]