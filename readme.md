# Support Desk App

Support ticket application built with the MERN stack. This is a project from my [React Front To Back](https://www.udemy.com/course/react-front-to-back-2022/?referralCode=4A622C7E48DB66154114) course.

# Bug fixes and updates

This branch aims to fix bugs found by students, it also features simpler state
management.
Currently these are tracked and documented in notes in the comments.
An easy way of seeing all the changes and fixes is to use a note highlighter
extension such as [This one for VSCode](https://marketplace.visualstudio.com/items?itemName=wayou.vscode-todo-highlight).
Where by you can easily list all the NOTE: and FIX: tags in the commments.

## Usage

### Set Environment Variables

Rename the .envexample to .env and add your [MongoDB](https://www.mongodb.com/) database URI and your JWT secret

### Install backend dependencies

```bash
npm install
```

### Install client dependencies

```bash
cd frontend
npm install
```

### Run app in development (frontend & backend)

```bash
npm run dev
```
