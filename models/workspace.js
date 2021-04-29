const mongoose = require('mongoose');

const { Schema } = mongoose;

const workspaceSchema = Schema({
  workspaceName: { type: String, required: true },
  owner: { type: Schema.Types.ObjectId, ref: 'users', required: true },
  dateCreated: { type: Date, default: Date.now },
});

module.exports = mongoose.model('workspace', workspaceSchema);
