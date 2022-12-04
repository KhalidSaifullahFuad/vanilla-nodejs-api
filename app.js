// Dependencies
const http = require("http");
const Todo = require("./controller");
const PORT = process.env.PORT || 3000;

// HTTP Server
const server = http.createServer((request, response) => {
	if (["/", "/api"].includes(request.url) && request.method === "GET") {
		response.writeHead(200, { "Content-Type": "application/json" });
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
		new Todo().getTodos().then((todos) => {
			response.writeHead(200, { "Content-Type": "application/json" });
			response.end(JSON.stringify(todos));
		});
	}

	// getById - /api/todo/:id : GET
	else if (request.url.match(/\/api\/todo\/(\d+)/) && request.method === "GET") {
		const id = request.url.split("/")[3];
		new Todo().getTodoById(id).then((todo) => {
			response.writeHead(200, { "Content-Type": "application/json" });
			response.end(JSON.stringify(todo));
		});
	}

	// create - /api/todo : POST
	else if (request.url == "/api/todo" && request.method === "POST") {
		new Todo().createTodo().then((todo) => {
			response.writeHead(201, { "Content-Type": "application/json" });
			response.end(JSON.stringify(todo));
		});
	}

	// update - /api/todo/ : PUT
	else if (request.url == "/api/todo" && request.method === "PUT") {
		let body = "";
		request
			.on("data", (chunk) => {
				console.log(chunk.toString());
				body += chunk.toString();
			})
			.on("end", () => {
				const { id, title, completed, date } = JSON.parse(body);
				const todo = { id: parseInt(id), title, completed, date };
				new Todo().updateTodo(todo).then((todo) => {
					response.writeHead(200, {
						"Content-Type": "application/json",
					});
					response.end(JSON.stringify(todo));
				});
			});
	}

	// delete - /api/todo/:id : DELETE
	else if (request.url.match(/\/api\/todo\/(\d+)/) && request.method === "DELETE") {
		const id = request.url.split("/")[3];
		new Todo().deleteTodoById(id).then((message) => {
			response.writeHead(200, { "Content-Type": "application/json" });
			response.end(JSON.stringify(message));
		});
	}

	// /help : GET
	else if (request.url == "/help" && request.method === "GET") {
		response.writeHead(200, { "Content-Type": "application/json" });
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
		response.writeHead(404, { "Content-Type": "application/json" });
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
