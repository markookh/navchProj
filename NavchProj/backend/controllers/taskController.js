// backend/controllers/taskController.js
const Task = require('../models/Task');

// Створення завдання
exports.createTask = async (req, res) => {
  try {
    const { title, description } = req.body;

    const newTask = new Task({
      title,
      description,
      user: req.user.userId
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Помилка при створенні завдання' });
  }
};

// Отримання всіх завдань поточного користувача
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.userId }).sort('-createdAt');
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Помилка при отриманні завдань' });
  }
};

// Оновлення завдання
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    const updatedTask = await Task.findOneAndUpdate(
      { _id: id, user: req.user.userId },
      { title, description, status },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: 'Завдання не знайдено' });
    }

    res.json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Помилка при оновленні завдання' });
  }
};

// Видалення завдання
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTask = await Task.findOneAndDelete({ _id: id, user: req.user.userId });

    if (!deletedTask) {
      return res.status(404).json({ message: 'Завдання не знайдено' });
    }

    res.json({ message: 'Завдання видалено' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Помилка при видаленні завдання' });
  }
};

