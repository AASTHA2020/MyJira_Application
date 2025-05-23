const express = require('express');
const {
    createTask,
    getAllTasks,
    getTask,
    updateTask,
    deleteTask,
    addComment
} = require('../controllers/task.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// Protect all routes - only check if user is authenticated
router.use(protect);

// Task routes
router.route('/')
    .get(getAllTasks)
    .post(createTask);

router.route('/:id')
    .get(getTask)
    .patch(updateTask)
    .delete(deleteTask);

// Comment routes
router.post('/:id/comments', addComment);

module.exports = router; 