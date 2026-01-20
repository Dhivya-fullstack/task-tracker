import React, { useState, useEffect } from 'react';
import axios from 'axios';
// Ensure this matches your new .env PORT
const API_URL = "https://task-tracker-pmuk.onrender.com/api/tasks";
const HEALTH_URL = "https://task-tracker-pmuk.onrender.com/status";

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");

  // Fetch tasks on page load
  useEffect(() => {
    axios.get(API_URL)
      .then(res => setTasks(res.data))
      .catch(err => console.error("Error fetching tasks:", err));
  }, []);

  const addTask = async () => {
    if (!input) return;
    try {
        const res = await axios.post(API_URL, { 
            title: input 
        });
        setTasks([...tasks, res.data]); // Update the UI instantly
        setInput(""); // Clear the input box
    } catch (err) {
        console.error("Network Error:", err);
        alert("Could not save task. Check if the server is running on 10000!");
    }
};
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Interactive Task Tracker</h1>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Add a new task..."
      />
      <button onClick={addTask}>Add Task</button>

      <ul>
        {tasks.map(task => (
          <li key={task._id}>{task.title}</li>
        ))}
      </ul>
      <hr />
      <p><a href={HEALTH_URL} target="_blank">View Server Health (Pug Page)</a></p>
    </div>
  );
}

export default App;
