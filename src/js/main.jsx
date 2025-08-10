import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import "../styles/index.css"; 

const API = "https://playground.4geeks.com/todo";
const username = "marc_ingles"; 

const App = () => {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  const createUser = async () => {
    try {
      const resp = await fetch(`${API}/users/${username}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([]),
      });
      console.log("createUser status:", resp.status);
      const text = await resp.text().catch(() => null);
      console.log("createUser body:", text);
      return resp.ok;
    } catch (err) {
      console.error("createUser error:", err);
      return false;
    }
  };

 
  const getTodos = async () => {
    try {
        const resp = await fetch(`https://playground.4geeks.com/todo/users/${username}`);
        console.log("getTodos status:", resp.status);

        if (!resp.ok) {
            console.error("getTodos response not ok:", resp.status);
            return;
        }

        const data = await resp.json();
        console.log("getTodos data:", data);
        setTodos(data.todos || []);
    } catch (error) {
        console.error("Error fetching todos:", error);
    }
};


  const addTodo = async (label) => {
    const task = { label, is_done: false };
    try {
      const resp = await fetch(`${API}/todos/${username}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });
      console.log("addTodo status:", resp.status);
      const body = await resp.text().catch(() => null);
      console.log("addTodo response body:", body);
      
      await getTodos();
    } catch (err) {
      console.error("addTodo error:", err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const resp = await fetch(`${API}/todos/${id}`, { method: "DELETE" });
      console.log("deleteTodo status:", resp.status, "id:", id);
      await getTodos();
    } catch (err) {
      console.error("deleteTodo error:", err);
    }
  };

  
  const clearTodos = async () => {
    try {
      for (const t of todos) {
        await fetch(`${API}/todos/${t.id}`, { method: "DELETE" });
      }
      await getTodos();
    } catch (err) {
      console.error("clearTodos error:", err);
    }
  };

  useEffect(() => {
    
    (async () => {
      await createUser();
      await getTodos();
    })();
    
  }, []);

  const handleKeyDown = async (e) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      await addTodo(inputValue.trim());
      setInputValue("");
    }
  };

  return (
    <div className="todo-container">
      <h1>todos</h1>
      <ul>
        <li>
          <input
            type="text"
            placeholder="Añadir tarea"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </li>

        {loading ? (
          <li className="empty">Cargando...</li>
        ) : todos.length === 0 ? (
          <li className="empty">No hay tareas, añadir tareas</li>
        ) : (
          todos.map((todo) => (
            <li key={todo.id} className="todo-item">
              {todo.label}
              <span className="delete" onClick={() => deleteTodo(todo.id)}>
                ❌
              </span>
            </li>
          ))
        )}
      </ul>

      {todos.length > 0 && (
        <>
          <div className="task-count">{todos.length} tareas restantes</div>
          <button onClick={clearTodos}>Limpiar todas</button>
        </>
      )}
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);

