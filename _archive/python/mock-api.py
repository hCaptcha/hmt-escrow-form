from fastapi import FastAPI
import json
import os

MOCK_TEST_API_FILE = os.getcwd() + '/test-jsons/labeling-requests-api.json'

app = FastAPI()

@app.get("/labeling-requests")
def get_labeling_requests():
    with open(MOCK_TEST_API_FILE, 'r') as file:
      json_file = json.load(file)
      return json_file


@app.get("/labeling-requests/{job_id}")
def get_labeling_requests(job_id):
  with open(MOCK_TEST_API_FILE, 'r') as file:
    json_file = json.load(file)
    obj = list(filter(lambda x: x['job_id'] == job_id, json_file['data']))
    print(obj)
    if len(obj) != 0:
      return {'data': obj[0]}
    return {'data': None}