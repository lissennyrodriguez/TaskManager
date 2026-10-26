const express = require('express');
const taskController = require('../controllers/task.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/', authenticateToken, taskController.listTasks);
router.get('/:id', authenticateToken, taskController.getTask);

router.post('/', authenticateToken, taskController.createTask);
router.put('/:id', authenticateToken, taskController.updateTask);
router.delete('/:id', authenticateToken, taskController.deleteTask);

module.exports = router;