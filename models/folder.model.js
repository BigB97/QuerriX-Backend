const mongoose = require('mongoose');

const { Schema } = mongoose;

const folderSchema = Schema({
  folder: { type: String, required: true },
  folder_icon: {
    url: { type: String },
    cloud_id: { type: String },
  },
  workspace: { type: Schema.Types.ObjectId, ref: 'workspace', required: true },
  dateCreated: { type: Date, default: Date.now },
});

module.exports = mongoose.model('folder', folderSchema);
