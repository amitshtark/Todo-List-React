import { useState, useEffect } from "react";
import "./App.css";

const mockApiUrl = "https://69d38817336103955f8f1a8e.mockapi.io/api/v1/tasks";

// Small reusable Task Item component to handle inline editing inherently
function TaskItem({ task, isApi, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text || task.title || "");

  function handleSave() {
    if (editText.trim() !== "") {
      onEdit(task.id, editText);
    } else {
      setEditText(task.text || task.title || ""); // Revert if essentially emptied
    }
    setIsEditing(false);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") {
      setEditText(task.text || task.title || "");
      setIsEditing(false);
    }
  }

  return (
    <li className={`todo-item ${task.completed ? 'completed-item' : ''}`}>
      <label className="todo-content">
        <input
          type="checkbox"
          className="checkbox"
          checked={!!task.completed}
          onChange={() => onToggle(task.id, !!task.completed)}
        />
        {isEditing ? (
          <input 
            className="text-content edit-input"
            autoFocus
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            onClick={(e) => e.preventDefault()}
          />
        ) : (
          <span className={`text-content ${task.completed ? "completed" : ""}`}>
            {task.text || task.title || "Nameless Task"}
          </span>
        )}
      </label>
      
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        {isApi && (
          <span style={{ fontSize: "0.75rem", color: "#94a3b8", marginRight: "4px" }} title={`MockAPI ID: ${task.id}`}>
            DB
          </span>
        )}
        
        {/* Edit Button */}
        {!isEditing && (
          <button
             className="btn-icon"
             onClick={() => setIsEditing(true)}
             title="Edit Task"
             type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
          </button>
        )}
        
        {/* Delete Button */}
        <button
          className="btn-icon delete-btn"
          onClick={() => onDelete(task.id)}
          title="Delete Task"
          type="button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
        </button>
      </div>
    </li>
  );
}

function App() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiTasks, setApiTasks] = useState([]);
  const [task, setTask] = useState("");

  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks !== null) {
      try {
        const parsed = JSON.parse(savedTasks);
        return parsed.map((t) => 
          typeof t === 'string' ? { id: Math.random().toString(36).substr(2, 9), text: t, completed: false } : t
        );
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  // GET Request implementation
  function fetchApiTasks() {
    setLoading(true);
    fetch(mockApiUrl)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch data");
        return response.json();
      })
      .then((data) => {
        setApiTasks(data); 
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }

  useEffect(() => {
    fetchApiTasks();
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // LOCAL METHODS
  function handleAddLocal() {
    if (task.trim() === "") return;
    const newTask = {
      id: Math.random().toString(36).substr(2, 9),
      text: task,
      completed: false,
    };
    setTasks([newTask, ...tasks]);
    setTask("");
  }

  function handleToggleLocal(id) {
    setTasks(tasks.map((t) => t.id === id ? { ...t, completed: !t.completed } : t));
  }

  function handleDeleteLocal(id) {
    setTasks(tasks.filter((t) => t.id !== id));
  }

  function handleEditLocal(id, newText) {
    setTasks(tasks.map((t) => t.id === id ? { ...t, text: newText } : t));
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleAddLocal();
  }

  // API METHODS
  function handleAddApi() {
    if (task.trim() === "") return;

    setLoading(true);
    fetch(mockApiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: task, completed: false }),
    })
      .then((response) => response.json())
      .then(() => {
        setTask(""); 
        fetchApiTasks();
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }

  function handleToggleApi(id, currentCompleted) {
    const newStatus = !currentCompleted;
    setApiTasks(apiTasks.map(t => t.id === id ? { ...t, completed: newStatus } : t)); // optimistic update

    fetch(`${mockApiUrl}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: newStatus })
    }).catch(() => fetchApiTasks()); // Refetch if failed
  }

  function handleDeleteApi(id) {
    setApiTasks(apiTasks.filter(t => t.id !== id)); // optimistic update

    fetch(`${mockApiUrl}/${id}`, {
      method: "DELETE"
    }).catch(() => fetchApiTasks()); // Refetch if failed
  }

  function handleEditApi(id, newText) {
    setApiTasks(apiTasks.map(t => t.id === id ? { ...t, text: newText } : t)); // optimistic update

    fetch(`${mockApiUrl}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: newText, title: newText })
    }).catch(() => fetchApiTasks()); // Refetch if failed
  }

  return (
    <div className="app-container">
      <div className="header">
        <h1>Tasks.</h1>
        <p>What do you need to get done?</p>
      </div>

      <div className="input-section">
        <input
          className="task-input"
          placeholder="Add a new task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{ width: '100%' }}
        />
        <div className="action-buttons">
          <button 
            className="btn-primary" 
            onClick={handleAddLocal}
            disabled={task.trim() === ""}
          >
            Add Locally
          </button>
          <button 
            className="btn-primary btn-green" 
            onClick={handleAddApi} 
            disabled={loading || task.trim() === ""}
            title="Type above and click here to POST to MockAPI database"
          >
            {loading ? "Syncing..." : "POST Task to DB"}
          </button>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="empty-state">No local tasks yet. Enjoy your day!</div>
      ) : (
        <ul className="todo-list">
          {tasks.map((t) => (
            <TaskItem 
              key={t.id} 
              task={t} 
              isApi={false}
              onToggle={handleToggleLocal}
              onDelete={handleDeleteLocal}
              onEdit={handleEditLocal}
            />
          ))}
        </ul>
      )}

      {/* API Interaction Section */}
      <div className="api-section">
        <h2>
          <span>MockAPI Data</span>
        </h2>
        
        {loading && apiTasks.length === 0 ? (
          <p className="status-text">Loading remote tasks from database...</p>
        ) : error ? (
          <p className="error-text">Failed to connect to API: {error}</p>
        ) : apiTasks.length === 0 ? (
          <p className="status-text" style={{ fontStyle: "italic" }}>No tasks in the cloud yet!</p>
        ) : (
          <ul className="api-todo-list todo-list">
            {apiTasks.map((todo) => (
              <TaskItem 
                key={todo.id} 
                task={todo} 
                isApi={true}
                onToggle={handleToggleApi}
                onDelete={handleDeleteApi}
                onEdit={handleEditApi}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;