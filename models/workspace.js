const mongoose = require('mongoose');

const { Schema } = mongoose;

const workspaceSchema = Schema({
  workspaceName: { type: String, required: true, unique: true },
  workspace_image: { type: String, unique: true },
  workspace_branding: { type: Array, unique: true },
  owner: { type: Schema.Types.ObjectId, ref: 'users', required: true },
  dateCreated: { type: Date, default: Date.now },
});

module.exports = mongoose.model('workspace', workspaceSchema);
