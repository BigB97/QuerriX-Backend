/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const {
  BadRequest, NotFound, InternalServerError, Unauthorized,
} = require('http-errors');

const Workspace = require('../models/workspace');
const Folder = require('../models/folder');
const CustomError = require('../utils/custom-error');

exports.createWorkspace = async (req, res) => {
  try {
    const { workspaceName } = req.body;
    const owner = req.user._id;

    if (!workspaceName) {
      throw CustomError('Workspace name is required', 400);
    }
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

exports.updateWorkspace = async (req, res) => {
  try {
    const { workspace } = req.params;
    const { workspaceName } = req.body;

    if (!mongoose.Types.ObjectId.isValid(workspace)) {
      throw BadRequest('invalid workspace id');
    }

    if (!workspaceName) {
      throw BadRequest('Workspace name is required');
    }

    const findWorkspace = await Workspace.findOne({ owner: req.user._id });
    if (!findWorkspace) {
      throw NotFound('workspace not found');
    }

    const updateWorkspace = await Workspace.updateOne(
      { _id: workspace },
      { $set: { workspaceName } },
    );
    if (!updateWorkspace) {
      throw InternalServerError('Update operation wasn\'t succesful');
    }

    return res.status(200).json({
      status: true,
      message: 'Workspace updated successfully',
    });
  } catch (error) {
    return res.status(error.status || 400).json({
      status: false,
      message: error.message,
    });
  }
};

exports.getAllWorkspace = async (req, res) => {
  try {
    const getAll = await Workspace.find({ owner: req.user.id });
    if (!getAll) {
      throw BadRequest('Unable to get workspaces');
    }
    if (getAll.length < 1) {
      return res.status(200).json({
        status: true,
        message: 'You dont have any workspace created',
        data: [],
      });
    }

    return res.status(200).json({
      status: true,
      message: 'Workspaces fetched succesfully',
      data: getAll,
    });
  } catch (error) {
    return res.status(error.status || 400).json({
      status: false,
      message: error.message,
    });
  }
};

exports.deleteWorkspace = async (req, res) => {
  try {
    const { workspace } = req.params;
    if (!mongoose.Types.ObjectId.isValid(workspace)) {
      throw BadRequest('invalid workspace id');
    }
    // eslint-disable-next-line camelcase
    const delete_workspace = await Workspace.findOneAndDelete({ owner: req.user._id });
    // eslint-disable-next-line camelcase
    if (!delete_workspace) {
      throw Unauthorized('Unable to delete this workspace');
    }

    return res.status(200).json({
      status: true,
      message: 'Workspace deleted succesfully',
      data: delete_workspace,
    });
  } catch (error) {
    return res.status(error.status || 400).json({
      status: false,
      message: error.message,
    });
  }
};
