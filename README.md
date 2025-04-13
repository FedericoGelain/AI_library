# AI_library
A simple web based library where Bookbot will assist in finding what you need.

## Requirements
[Node.js](https://nodejs.org/en/download) <br />
[Groq API key](https://console.groq.com/keys) <br />
[MySQL](https://www.mysql.com/downloads/)

## Setup
After installing MySQL, open the Command Line Client, set your password, create a database and access it:
```SQL
CREATE DATABASE your_db;
USE your_db;
```
Create the library table that will be used to manage all books:
```SQL
CREATE TABLE books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    year INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);
```

After cloning this repo, create a .env file in the root folder which will have this structure:
```console
DB_HOST='localhost'
DB_USER='your_user'
DB_PASSWD='your_password'
DB_NAME='your_db'
GROQ_API_KEY='your API key'
```
After that, open a terminal in the root folder of the project and type the following commands to install all dependencies and run the backend:
```console
npm init -y
npm install express mysql2 dotenv cors groq-sdk
node node --env-file=.env .\backend\index.js
```
If everything went right, you should see these as output:
```console
Server running on port 3000
Connected to MySQL
```
After that, open the frontend/index.html in a browser of your choice and enjoy the app :D
