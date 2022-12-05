// Dependencies
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
		return new Promise((resolve, reject) => {
			const { title } = todo;
			const id = data.reduce((max, todo) => Math.max(max, todo.id), 0) + 1;
			const completed = false;
			const date = new Date().toISOString().slice(0, 10);
			const newTodo = { id, title, completed, date };

			if(!title){
				return reject({ message: `Todo title is required` });
			}

			data.push(newTodo);
			fs.writeFileSync("./data.json", JSON.stringify(data));

			resolve(newTodo);
		});
	}

	// update
	updateTodo(todo) {
		return new Promise((resolve, reject) => {
			const index = data.findIndex((item) => item.id === todo.id);
			const date = new Date().toISOString().slice(0, 10);

			if (index === -1) {
				return reject({ message: `Todo with id ${todo.id} not found` });
			}

			if(!todo.title) {
				return reject({ message: `Todo title is required` });
			}
			data[index].title = todo.title;
			data[index].completed = todo.completed || data[index].completed;
			data[index].date = date;

			fs.writeFileSync("./data.json", JSON.stringify(data[index]));

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
