import express from "express";

const app = express();
const PORT = 3000;

app.use(express.json());

const logger = (
	req: express.Request,
	res: express.Response,
	next: express.NextFunction,
) => {
	console.log(
		`Received ${req.method} request for ${req.url} at ${new Date().toISOString()}`,
	);
	next();
};
app.use(logger);

type Todo = {
	id: number;
	title: string;
	completed: boolean;
};

const todos: Todo[] = [];

// === implment GET & POST ====

app.get("/todos", (req, res) => {
	res.status(200).send(todos);
});

app.post("/todos", (req, res) => {
	const { title, completed } = req.body;
	
  const lastTodo = todos[todos.length - 1];
  
  const newId = lastTodo ? lastTodo.id + 1 : 1;

  const newTodo = {
    id: newId,
    title,
    completed,
  };

	if (!title || completed === undefined) {
		res.status(400).send({ message: "Title and completed are required" });
		return;
	}

	todos.push(newTodo);
	res.status(201).send(newTodo);
});

// === Implement GET (by id), PUT, and DELETE ====

app.get("/todos/:id", (req, res) => {

  const id = parseInt(req.params.id);
  
  const todo = todos.find((todo) => todo.id === id);

  if (!todo) {
    res.status(404).send({ message: "Todo not found" });
    return;
  }
  
  res.status(200).send(todo);
});


app.put("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { title, completed } = req.body;

  
  if (!title || completed === undefined) {
    res.status(400).send({ message: "Title and completed are required" });
    return;
  }

  const todoId = todos.findIndex((todo) => todo.id === id);

  
  if (todoId === -1) {
    res.status(404).send({ message: "Todo not found" });
    return;
  }

  todos[todoId] = { id, title, completed };
  res.status(200).send(todos[todoId]);
});


app.delete("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const todoId = todos.findIndex((todo) => todo.id === id);

  if (todoId === -1) {
    res.status(404).send({ message: "Todo not found" });
    return;
  }

  todos.splice(todoId, 1);
  
  res.status(201).send("file deleted successfully");
});


// === Catch-all Error Handler ====
app.use((req, res) => {
  res.status(404).send({ message: "Route not found" });
});

app.listen(PORT, () => {
	console.log(`Server is listening on ${PORT}`);
});
