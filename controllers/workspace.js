/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const Workspace = require('../models/workspace');
const Folder = require('../models/folder');
const CustomError = require('../utils/custom-error');
const { compareSync } = require('bcryptjs');

exports.createWorkspace = async (req, res) => {
  try {
    const { workspaceName } = req.body;
    const owner = req.user._id;

    const workspace = await Workspace.create({
      workspaceName,
      owner,
    });

    if (!workspace) {
      throw CustomError('An error occured', 500);
    }
    return res.status(201).json({
      status: true,
      message: 'Data saved successfully',
      data: workspace,
    });
  } catch (error) {
    return res.status(error.status || 400).json({
      status: false,
      message: error.message,
    });
  }
};

exports.createFolder = async (req, res) => {
  try {
    const { folder } = req.body;
    const { workspace } = req.params;

    if (!mongoose.Types.ObjectId.isValid(workspace)) {
      throw CustomError('Invalid workspace id', 401);
    }
    if (!folder || folder.length < 1) {
      throw CustomError('Please provide the folder name', 400);
    }
    const createFolder = await Folder.create({ folder, workspace });
    if (!createFolder) {
      throw CustomError('An error occured', 500);
    }
    return res.status(201).json({
      status: true,
      message: 'Folder created successfully',
    });
  } catch (error) {
    return res.status(error.status || 400).json({
      status: false,
      message: error.message,
    });
  }
};
