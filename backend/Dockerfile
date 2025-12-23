FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

ENV MVP_JWT_SECRET=prod-secret-change-this
ENV OPENAI_API_KEY=
ENV MVP_DB=/data/mvp.sqlite3

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
