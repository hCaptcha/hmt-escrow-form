#!/bin/sh
flask run & 
uvicorn mock-api:app