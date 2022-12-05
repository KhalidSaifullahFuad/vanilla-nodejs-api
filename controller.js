const fs = require("fs");

const data = require("./data.json");

class Controller {
	// get all
	getTodos() {
		return Promise.resolve(data);
	}

	// get by id
	getTodoById(id) {
		return new Promise((resolve, reject) => {
			const todo = data.find((todo) => todo.id === parseInt(id));
			if (!todo) {
				return reject({ message: `Todo with id ${id} not found` });
			}
			resolve(todo);
		});
	}

	// store
	createTodo(todo) {
		return new Promise((resolve) => {
			const id = data.reduce((max, todo) => Math.max(max, todo.id), 0) + 1;
			const newTodo = { id, ...todo };
			data.push(newTodo);
			fs.writeFileSync("./data.json", JSON.stringify(data));
			resolve(newTodo);
		});
	}

	// update
	updateTodo(todo) {
		return new Promise((resolve, reject) => {
			const index = data.findIndex((item) => item.id === todo.id);
			if (index === -1) {
				return reject({ message: `Todo with id ${todo.id} not found` });
			}
			data[index] = todo;

			fs.writeFileSync("./data.json", JSON.stringify(data));

			resolve(todo);
		});
	}

	// delete
	deleteTodoById(id) {
		return new Promise((resolve, reject) => {
			const index = data.findIndex((todo) => todo.id === parseInt(id));
			if (index === -1) {
				return reject({ message: `Todo with id ${id} not found` });
			}
			data.splice(index, 1);
			fs.writeFileSync("./data.json", JSON.stringify(data));
			resolve({ message: `Successfully deleted` });
		});
	}
}

module.exports = Controller;
