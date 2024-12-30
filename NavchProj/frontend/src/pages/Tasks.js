import React, { useEffect, useState } from 'react';
import { TextField, Button, Typography, Box, Card, CardContent, IconButton } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import axios from 'axios';

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [editingTask, setEditingTask] = useState(null);
  const [statusOptions] = useState(['pending', 'in-progress', 'completed']);

  const token = localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const getTasks = async () => {
    try {
      const response = await axios.get('/api/tasks', config);
      setTasks(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  const createTask = async () => {
    try {
      await axios.post('/api/tasks', newTask, config);
      setNewTask({ title: '', description: '' });
      getTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const updateTask = async (id, updatedData) => {
    try {
      await axios.patch(`/api/tasks/${id}`, updatedData, config);
      setEditingTask(null);
      getTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`/api/tasks/${id}`, config);
      getTasks();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Список завдань</Typography>

      {/* Форма для створення нового завдання */}
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Назва"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          sx={{ mr: 1 }}
        />
        <TextField
          label="Опис"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          sx={{ mr: 1 }}
        />
        <Button variant="contained" onClick={createTask}>Додати</Button>
      </Box>

      {/* Відображення списку завдань */}
      {tasks.map((task) => (
        <Card key={task._id} sx={{ mb: 2 }}>
          <CardContent>
            {editingTask === task._id ? (
              <Box>
                <TextField
                  label="Назва"
                  value={task.title}
                  onChange={(e) =>
                    setTasks((prev) =>
                      prev.map((t) =>
                        t._id === task._id ? { ...t, title: e.target.value } : t
                      )
                    )
                  }
                  sx={{ mr: 1 }}
                />
                <TextField
                  label="Опис"
                  value={task.description}
                  onChange={(e) =>
                    setTasks((prev) =>
                      prev.map((t) =>
                        t._id === task._id ? { ...t, description: e.target.value } : t
                      )
                    )
                  }
                  sx={{ mr: 1 }}
                />
                <TextField
                  select
                  SelectProps={{ native: true }}
                  label="Статус"
                  value={task.status}
                  onChange={(e) =>
                    setTasks((prev) =>
                      prev.map((t) =>
                        t._id === task._id ? { ...t, status: e.target.value } : t
                      )
                    )
                  }
                  sx={{ mr: 1, width: '150px' }}
                >
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </TextField>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() =>
                    updateTask(task._id, {
                      title: task.title,
                      description: task.description,
                      status: task.status,
                    })
                  }
                >
                  Зберегти
                </Button>
              </Box>
            ) : (
              <Box>
                <Typography variant="h6">{task.title}</Typography>
                <Typography variant="body1">{task.description}</Typography>
                <Typography variant="body2">
                  <strong>Статус:</strong> {task.status}
                </Typography>
              </Box>
            )}

            <Box sx={{ mt: 1 }}>
              <IconButton onClick={() => setEditingTask(task._id)}>
                <Edit />
              </IconButton>
              <IconButton onClick={() => deleteTask(task._id)}>
                <Delete />
              </IconButton>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

export default Tasks;

