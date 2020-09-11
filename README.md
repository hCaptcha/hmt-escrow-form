Install virtualenv python3 and use requirements.txt to install dependencies.
Also install packages as highlighted in the hmt-escrow repository.

# Usage of Flask Server
```bash
export FLASK_ENV=development
export FLASK_APP=app.py

flask run
```
go to localhost:5000

# Run mock server for label requests
```bash
uvicorn mock-api:app
```