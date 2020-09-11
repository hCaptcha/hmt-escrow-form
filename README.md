Install virtualenv python3 and use requirements.txt to install dependencies.
Also install packages as highlighted in the hmt-escrow repository.

# Usage of Flask Server
```bash
export FLASK_ENV=development
export FLASK_APP=app.py
export HMT_API=http://127.0.0.1:8000/labeling-requests | <WHATEVER YOUR URL IS>

flask run
```
go to localhost:5000

# Run mock server for label requests
```bash
uvicorn mock-api:app
```