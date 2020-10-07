# HMT Escrow Form
Purely based in javascript now, interacts, validates automatically from the blockchain.

Install Dependencies:

```bash
yarn install
```

Run this as a http-server:
```
yarn run start
```


go to localhost:5000


# To run on docker
```
docker build -f ./Dockerfile --tag hmt-escrow-form .
docker run -p 5000:5000 --name hmtescform hmt-escrow-form
```

go to localhost:5000
 