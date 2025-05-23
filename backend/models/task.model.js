const mongoose = require('mongoose');

// Task Schema
const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title for the task'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please provide a description for the task'],
        trim: true
    },
    status: {
        type: String,
        enum: ['todo', 'in-progress', 'completed'],
        default: 'todo',
        required: true
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    assignee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please assign the task to a user']
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    dueDate: {
        type: Date,
        required: [true, 'Please provide a due date']
    },
    comments: [{
        text: {
            type: String,
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    activityLog: [{
        action: {
            type: String,
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

// Index for better search performance
taskSchema.index({ title: 'text', description: 'text' });

// Method to add activity log
taskSchema.methods.addActivity = function(action, userId) {
    this.activityLog.push({
        action,
        user: userId
    });
    return this.save();
};

const Task = mongoose.model('Task', taskSchema);

module.exports = Task; 