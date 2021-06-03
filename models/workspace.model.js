const mongoose = require('mongoose');

const { Schema } = mongoose;

const workspaceSchema = Schema({
  workspaceName: { type: String, required: true, unique: true },
  workspace_image: { type: String, unique: true },
  workspace_member: { type: Array, unique: true },
  workspace_branding: {
    primary: { type: String },
    secondary: { type: String },
    logo: { type: String },
  },
  owner: { type: Schema.Types.ObjectId, ref: 'users', required: true },
  dateCreated: { type: Date, default: Date.now },
});

module.exports = mongoose.model('workspace', workspaceSchema);
