function getRequestBody(request) {
	return new Promise((resolve, reject) => {
		let body = "";

		request.on("data", (chunk) => {
			body += chunk.toString();
		});

		request.on("end", () => {
			if(!body) return reject();

			resolve(JSON.parse(body)); // <--- convert to JSON
		});
	});
}

module.exports = { getRequestBody };
