# Zwallet API

Zwallet is an application that focussing in banking needs for all users the world.

## Build with

- [Node.js](https://nodejs.org/en/)
- [Express.js](https://expressjs.com/)

## Requirements

- [Node.js](https://nodejs.org/en/)
- [Postman](https://www.getpostman.com/) for testing
- [Database](db_zwallet.sql)

## Project setup

```
npm install
```

### Install nodemon

Nodemon is a tool that helps develop node.js based applications by automatically restarting the node application when file changes in the directory are detected.

If you have already installed, skip this step.

```
npm install -g nodemon
```

### Setup .env example

Create .env file in your root project folder.

```
PORT = 4000
DB_HOST = localhost
DB_USER = root
DB_PASSWORD = your_password
DB_DATABASE = db_zwallet
PRIVATE_KEY = your_private_key
BASE_URL = http://localhost:4000
# For Redirect User When Click Link Activation. Just Change The 'localhost:8080'
BASE_URL_ACTIVATE = http://localhost:8080/verify-account
BASE_URL_RESET_PASSWORD = http://localhost:8080/reset-password
# For Send Email To User
EMAIL_USER = your_email
PASS_USER = your_password_email
```

### Run project for development

```
npm run dev
```

## API documentation link

See [here](https://documenter.getpostman.com/view/8880894/TVKHTuW7)

## License

[MIT](https://choosealicense.com/licenses/mit/)
