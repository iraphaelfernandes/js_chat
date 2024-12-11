
### Getting the project running

For this project, you will have to run a backend server, that serves a basic HTTP API.
And a second server, that will server your frontend files (HTML page and linked documents).

#### Prerequesites

The backend and frontend servers are coded with NodeJS. You need to have a working
installation of NodeJS on your machine. Normally if you followed the first assignment,
that is already the case.

#### Running the backend

1. Go to the `backend/` directory. 
2. The first time, you need to install the project dependencies

    ```
    npm install
    ```

    No need to run this command again after that.

3. Start the server with

    ```
    npm run start
    ```

4. By default the backend server runs on port 3014, you can access it at http://localhost:3014

#### Starting the frontend server

1. Go to the `frontend/` directory. 
2. The first time, you need to install the project dependencies

    ```
    npm install
    ```

    No need to run this command again after that.

3. Start the server with

    ```
    npm run start
    ```

4. By default the frontend server runs on port 8000, you can access it at http://localhost:8000.
   The project frontend page is at http://localhost:8000/chatroom/index.html


### Server API Specifiation

If you are using VS Code, "Thunder Client" is an excellent plugin that helps you easily
test a server API by hand-crafting HTTP requests.

Another tool is Postman, but it requires to make an account by them.

You can also use the command line tool `curl`, although it's not as user friendly.

#### `GET /chat`

Get the whole content of the chatroom. The response is a JSON object that looks like this :

```json
[{
    "author": "admin",
    "message": "Welcome to our chat"
}, {
    "author": "Bérénice",
    "message": "Que le jour recommence ..."
}, ...]
```

#### `POST /message`

Send a message to the chat. The request body must contain a JSON object
of the following format : 

```json
{
    "author": "Antiochus",
    "message": "Puisse le ciel verser..."
}
```

The fields must not be empty. If an invalid request is sent, the server
will respond with a `400` status code.

In case of success, the server will respond with the content of the chat
in JSON format (same format than a request to `GET /chat`)

#### `GET /censorMessage?message=Message content`

This this a censoring service provided by the server. You can send it a message,
and it will check it and return a censored version if it detects obscene words
such as "Lyon", "PSG", "English" or "England". This is a Stéphanois and French 
chatroom after all.

The message you want to censor must be sent with the query parameter `message`.

> **Note:** In javascript, you will not manually build the URL with the query
> parameter after the `?` sign. There are available functions in JS to make that for you.

The server will respond with the following JSON object :

```json
{
    "originalMessage": "The English are a lovely people", 
    "censoredMessage": "The *** are a lovely people"
}
```

#### `DELETE /chat`

Making a request to this endpoint resets the content of the chatroom. 
 
The server replies with a JSON object representing the content of the chatroom
after it has been cleared (same format than `GET /chat`)

### Instructions

1. Write your code in the `frontendChat.js` file. You need to link this file to your HTML document, in order for it to run when the webpage loads in the web browser.

> **Note:** beware of the browser cache. It's a good idea to always use the "Hard Refresh" functionality of your browser.

2. Mandatory features to use, or things to avoid :

    1. Use the `fetch()` function to make your AJAX calls
    2. Use at least once in your code the `await`/`async` syntax
    3. Never set a style directly from javascript. If you need the visual appearance
       of an element to change, you use JS to set or remove classes to that element, 
       and you edit the `style.scss` stylesheet in order to have styling rules that
       matches the classes.
    4. Like with any software development, organize your code coherently and make it readable.
       Use comments, seperate things into coherent functions. You don't neet to seperate
       your code into several files for this assignment, although it is possible if you
       want, by using ES6 modules.
    5. Do **not** seperate your code in different files without ES6 modules
    (we try to avoid ES5 practices as they are deprecated)
    

3. Implement the following functionalities

    1. Send messages when clicking on the "Send" button **or** when the user presses
    the <Enter> key while being focused in the message input.

    2. Description of the message sending workflow :

        - the frontend must first use the censoring service provided by the server. It should call
        `GET /censorMessage?message=Content of the message`
        - the frontend must take the censored message given as a reply
        - the frontend must now send the message to the chat server, by calling `POST /message` and giving
        the user alias and the message content (the censored version), in the body of the request
        in JSON format. See the server API specification.
        - the frontend should update the content of the chat window with the response given by the server

    3. Prevent sending empty messages or empty alias. 
       
       - Disable the "Send" button, and don't react on the "Enter" keypress, if either the alias
  or the message input are empty

    4. Display the error popup, in case one of your network requests fails.
    
        - Anytime you make a network request, there is a possibility for failure. Take that
        into account, and handle such cases. The best way to get a network error is
        to stop your server program.
        - When you get a network error, you should display the error message popup. You don't
        need to change the message, the default message in place in the template is enough.

    5. Make the "Close" button of the error popup work.

    6. Poll regularly the server to get real time update on your chat.

        - Use the API request `GET /chat` to get the whole content of the chat, and update
        the content of the chat window with the result.
        - Because we can't be notified by the server in case of updates, we need to poll it, 
        that is make constant requests on a fixed short delay. You will make a request 
        every 500ms, for a good user experience. You can use the native JS function `setInterval()`.
        - Once this works, you can open several tabs with your frontend (that is, making
        several clients for your web server), and you will be able to make the clients communicate
        between them.

    7. Make the "Clear chat" button work
    When clicking the button, use the server API endpoint `DELETE /chat`

    8. For a better UX flow, empty the message input field after a message has been sent.# js_chat
