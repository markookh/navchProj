// backend/routes/taskRoutes.js
const express = require('express');
const { createTask, getTasks, updateTask, deleteTask } = require('../controllers/taskController');
const auth = require('../middleware/auth');

const router = express.Router();

// Усі завдання вимагають авторизації
router.post('/', auth, createTask);
router.get('/', auth, getTasks);
router.patch('/:id', auth, updateTask);
router.delete('/:id', auth, deleteTask);

module.exports = router;
