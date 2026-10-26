
const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
    enum: [
      'TASK_CREATED',
      'TASK_UPDATED',
      'TASK_STATUS_UPDATED',
      'TASK_DELETED',
      'USER_REGISTERED',
      'USER_LOGIN',
      'USER_ROLE_CHANGED',
    ],
  },

  entityType: {
    type: String,
    required: true,
    enum: ['Task', 'User'],
  },

  entityId: {
    type: String,
    required: true,
  },

  userId: {
    type: Number,
    required: true,
  },

  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  versionKey: false,
});

activitySchema.index({ entityType: 1, entityId: 1 });
activitySchema.index({ createdAt: -1 });

module.exports = mongoose.model('Activity', activitySchema);
