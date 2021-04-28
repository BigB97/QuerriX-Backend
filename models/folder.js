const mongoose = require('mongoose');

const { Schema } = mongoose;

const folderSchema = Schema({
  folder: { type: String, required: true },
  workspace: { type: Schema.Types.ObjectId, ref: 'workspace', required: true },
  dateCreated: { type: Date, default: Date.now },
});

module.exports = mongoose.model('folder', folderSchema);
