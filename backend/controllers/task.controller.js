const Task = require('../models/task.model');
const { v4: uuidv4 } = require('uuid');

// Create new task
exports.createTask = async (req, res) => {
    try {
        const task = await Task.create({
            ...req.body,
            createdBy: req.user.id
        });

        // Add activity log
        await task.addActivity('Task created', req.user.id);

        res.status(201).json({
            success: true,
            data: {
                task
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Get all tasks
exports.getAllTasks = async (req, res) => {
    try {
        const { status, priority, assignee, search } = req.query;
        const query = {};

        // Filter by status
        if (status) {
            query.status = status;
        }

        // Filter by priority
        if (priority) {
            query.priority = priority;
        }

        // Filter by assignee
        if (assignee) {
            query.assignee = assignee;
        }

        // Search by title or description
        if (search) {
            query.$text = { $search: search };
        }

        const tasks = await Task.find(query)
            .populate('assignee', 'name email')
            .populate('createdBy', 'name email')
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            results: tasks.length,
            data: {
                tasks
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Get single task
exports.getTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate('assignee', 'name email')
            .populate('createdBy', 'name email')
            .populate('comments.user', 'name email');

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                task
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Update task
exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        ).populate('assignee', 'name email')
         .populate('createdBy', 'name email');

        // Add activity log
        await updatedTask.addActivity('Task updated', req.user.id);

        res.status(200).json({
            success: true,
            data: {
                task: updatedTask
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Delete task
exports.deleteTask = async (req, res) => {
    try {
        // First find the task (with access to instance methods)
        const task = await Task.findById(req.params.id)
            .populate('assignee', 'name email')
            .populate('createdBy', 'name email');

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        // Add activity before deletion — because after deletion, instance methods like addActivity are gone
        await task.addActivity('Task deleted', req.user.id);

        // Now delete it
        await Task.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Task deleted successfully',
            data: null
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};



// Add comment to task
exports.addComment = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        task.comments.push({
            text: req.body.text,
            user: req.user.id
        });

        await task.save();

        // Add activity log
        await task.addActivity('Comment added', req.user.id);

        res.status(200).json({
            success: true,
            data: {
                task
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}; 