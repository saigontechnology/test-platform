# Test Platform API setup

### 1. Install dependencies
Install npm dependencies:

```
npm install
```

### 2. Setup env variables.

Setup env following .env.example structure.

### 3. Sync prisma model

Run the following command to sync prisma database file:

```
npm run migrate:dev
```

### 4. Start API server

```
npm run dev
```

The server is now running on `http://localhost:3000`. You can now run the API requests, e.g. [`http://localhost:3000/api`](http://localhost:3000/api) to go to swagger documentation.