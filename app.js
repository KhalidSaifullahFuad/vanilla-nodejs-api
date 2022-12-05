// Dependencies
const http = require("http");

const Todo = require("./controller");
const { getRequestBody } = require("./utils");

// Constants
const PORT = process.env.PORT || 3000;
const CONTENT_TYPE_JSON = { "Content-Type": "application/json" };

// HTTP Server
const server = http.createServer((request, response) => {
	const todo = new Todo();

	if (["/", "/api"].includes(request.url) && request.method === "GET") {
		response.writeHead(200, CONTENT_TYPE_JSON);
		response.end(
			JSON.stringify({
				info: "Vanilla Node.js Todo API",
				version: "1.0.0",
				author: "Khalid Saifullah Fuad",
				tip: "Use /help for all available endpoints",
			})
		);
	}

	// getAll - /api/todo : GET
	else if (request.url == "/api/todo" && request.method === "GET") {
		todo.getTodos().then((todos) => {
			response.writeHead(200, CONTENT_TYPE_JSON);
			response.end(JSON.stringify(todos));
		});
	}

	// getById - /api/todo/:id : GET
	else if (request.url.match(/\/api\/todo\/(\d+)/) &&	request.method === "GET") {
		const id = request.url.split("/")[3];

		todo.getTodoById(id)
			.then((todo) => {
				response.writeHead(200, CONTENT_TYPE_JSON);
				response.end(JSON.stringify(todo));
			})
			.catch((err) => {
				response.writeHead(404, CONTENT_TYPE_JSON);
				response.end(JSON.stringify(err));
			});
	}

	// create - /api/todo : POST
	else if (request.url == "/api/todo" && request.method === "POST") {
		getRequestBody(request).then((todoData) => {
			todo.createTodo(todoData).then((todo) => {
				response.writeHead(201, CONTENT_TYPE_JSON);
				response.end(JSON.stringify(todo));
			})
			.catch((err) => {
				response.writeHead(400, CONTENT_TYPE_JSON);
				response.end(JSON.stringify(err));
			});
		})
		.catch((err) => {
			response.writeHead(400, CONTENT_TYPE_JSON);
			response.end(JSON.stringify({ message: "Invalid request body", err }));
		});
	}

	// update - /api/todo/ : PUT
	else if (request.url == "/api/todo" && request.method === "PUT") {
		getRequestBody(request).then((todoData) => {
			todo.updateTodo(todoData).then((todo) => {
				response.writeHead(200, CONTENT_TYPE_JSON);
				response.end(JSON.stringify(todo));
			})
			.catch((err) => {
				response.writeHead(404, CONTENT_TYPE_JSON);
				response.end(JSON.stringify(err));
			});
		})
		.catch((err) => {
			response.writeHead(400, CONTENT_TYPE_JSON);
			response.end(JSON.stringify({ message: "Invalid request body", err }));
		});
	}

	// delete - /api/todo/:id : DELETE
	else if (request.url.match(/\/api\/todo\/(\d+)/) && request.method === "DELETE") {
		const id = request.url.split("/")[3];
		todo.deleteTodoById(id)
			.then((message) => {
				response.writeHead(200, CONTENT_TYPE_JSON);
				response.end(JSON.stringify(message));
			})
			.catch((err) => {
				response.writeHead(404, CONTENT_TYPE_JSON);
				response.end(JSON.stringify(err));
			});
	}

	// /help : GET
	else if (request.url == "/help" && request.method === "GET") {
		response.writeHead(200, CONTENT_TYPE_JSON);
		response.end(
			JSON.stringify({
				"GET - /api/todo": "get all todos",
				"GET - /api/todo/:id": "retrieve a single todo",
				"POST - /api/todo": "create a new todo",
				"PUT - /api/todo/:id": "update a todo",
				"DELETE - /api/todo/:id": "delete a todo",
				"GET - /help": "all available endpoints",
			})
		);
	}

	// 404
	else {
		response.writeHead(404, CONTENT_TYPE_JSON);
		response.end(
			JSON.stringify({
				message: "Enter a valid endpoint and request method",
				tip: "Use /help for all available endpoints",
			})
		);
	}
});

// Start the server
server.listen(PORT, () => {
	console.log(`> Server is running on port ${PORT}...`);
});
