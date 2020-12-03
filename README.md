Install virtualenv python3 and use requirements.txt to install dependencies.
Also install packages as highlighted in the hmt-escrow repository.

# Usage of Flask Server
```bash
export FLASK_ENV=development
export FLASK_APP=app.py
flask run
```
go to localhost:5000

# To run on docker
```
docker build -f ./Dockerfile --tag hmt-escrow-form .
docker run -p 5000:5000 --name hmtescform hmt-escrow-form
```

go to localhost:5000
 