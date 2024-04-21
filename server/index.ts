import express from "express";
const app = express();
import cors from "cors";
import { pool } from "./db";

//moddleware
app.use(cors());
app.use(express.json());

//Routes//

//create a todo
app.post("/createTodo", async (req, res) => {
  try {
    const { description, category } = req.body;
    if (description.length > 255 || description.length === 0) {
      return res
        .status(400)
        .json("your todo must be between 1 to 255 characters");
    }
    const newTodo = await pool.query(
      "INSERT INTO todo(description,category) VALUES($1, $2) RETURNING *",
      [description, category]
    );

    res.json(newTodo.rows[0]);
  } catch (error) {
    console.error(error);
  }
});

//get all todo

app.get("/todos", async (req, res) => {
  try {
    const allTodos = await pool.query("SELECT * FROM todo");
    res.status(200).json(allTodos.rows);
  } catch (error) {
    console.error(error);
  }
});

//get a todo
app.get("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await pool.query("SELECT * FROM todo WHERE todo_id =$1", [id]);
    res.status(200).json(todo.rows);
  } catch (error) {
    console.log(error);
  }
});

//update a todo
app.put("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description, category } = req.body;
    if (description.length > 255 || description.length === 0) {
      return res
        .status(400)
        .json("your todo must be between 1 to 255 characters");
    }

    if (category.length > 255 || category.length === 0) {
      return res
        .status(400)
        .json("your category input must be between 1 to 255 characters");
    }
    const updatetodo = await pool.query(
      "UPDATE todo SET description = $1, category = $2 WHERE todo_id = $3",
      [description, id]
    );

    res.status(200).json("todo updated");
  } catch (error) {
    console.error(error);
  }
});

//delete a todo
app.delete("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteTodo = await pool.query("DELETE FROM todo WHERE todo_id = $1", [
      id,
    ]);

    res.status(200).json("Todo deleted");
  } catch (error) {
    console.error(error);
  }
});
app.listen(5000, () => console.log("listening on port 5000"));
