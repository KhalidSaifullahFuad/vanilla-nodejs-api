// Dependencies
const http = require("http");
const PORT = process.env.PORT || 3000;

// HTTP Server
const server = http.createServer((request, response) => {
	if (request.url === "/" && request.method === "GET") {
		response.writeHead(200, { "Content-Type": "application/json" });
		response.end(JSON.stringify({message: "This is a Vanilla Node.js API"}));
	} else {
		response.writeHead(404, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ message: "Page not found" }));
	}
});

// Start the server
server.listen(PORT, () => {
	console.log(`> Server is running on port ${PORT}...`);
});
