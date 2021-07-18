/* eslint-disable camelcase */
const mongoose = require('mongoose');
const {
  BadRequest,
  NotFound,
  InternalServerError,
  Unauthorized,
} = require('http-errors');
const cloudinary = require('cloudinary');
const icongen = require('../utils/icon');
const Folder = require('../models/folder.model');
const Workspace = require('../models/workspace.model');
const CustomError = require('../utils/custom-error');

// Creating folders in workspace
exports.createFolder = async (req, res) => {
  try {
    // receive folder name from request
    const { folderName } = req.body;
    // receive workspace id from payload
    const { workspace } = req.params;

    // check if workspace id is valid
    if (!mongoose.Types.ObjectId.isValid(workspace)) {
      throw new CustomError('Invalid workspace id', 401);
    }
    // check if folder name is empty
    if (!folderName || folderName.length < 1) {
      throw new CustomError('Please provide the folder name', 400);
    }

    const icon = await icongen(folderName);
    // create folder
    const createFolder = await Folder.create({
      folderName,
      workspace,
      folder_icon: {
        url: icon.secure_url,
        cloud_id: icon.public_id,
      },
    });

    if (!createFolder) {
      throw new CustomError('An error occured', 500);
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

// Update folder
exports.updateFolder = async (req, res) => {
  try {
    // Get the workspace id,new name and new image
    const { folderid } = req.params;
    const { folderName, url } = req.body;

    // Check if the workpace id is ObjectId
    if (!mongoose.Types.ObjectId.isValid(folderid)) {
      throw new BadRequest('invalid folder id');
    }
    // Check if the Workspace name is valid
    if (!folderName) {
      throw new BadRequest('Folder name is required');
    }
    // Find the the workspace for conditions
    const findFolder = await Folder.findOne({ _id: folderid });

    // Check if the workspace is present in the DB
    if (!findFolder) {
      throw new NotFound('Folder not found');
    }

    // Check if the Workspace name is exist
    if (findFolder.folderName === folderName) {
      throw new BadRequest('Folder name already exist, change name');
    }

    // Then search the workspace for prev imageurl and delete
    const { cloud_id } = findFolder.folder_icon;
    if (cloud_id) {
      await cloudinary.uploader.destroy(cloud_id);
    }

    // update workspace
    const updateFolder = await Folder.updateOne(
      { _id: folderid },
      {
        $set: {
          folderName,
          folder_icon: { url },
        },
      }
    );
    // check if workspace was updated
    if (!updateFolder) {
      throw new InternalServerError("Update operation wasn't succesful");
    }
    // Return sucess message
    return res.status(200).json({
      status: true,
      message: 'Folder updated successfully',
    });
  } catch (error) {
    return res.status(error.status || 400).json({
      status: false,
      message: error.message,
    });
  }
};

// Get all Folder
exports.getAllFolder = async (req, res) => {
  try {
    const { workspaceid } = req.params;
    const getAll = await Folder.find({ workspace: workspaceid });
    if (!getAll) {
      throw new BadRequest('Unable to get folder');
    }
    if (getAll.length < 1) {
      return res.status(200).json({
        status: true,
        message: 'You dont have any folder in this workspace',
        data: [],
      });
    }

    return res.status(200).json({
      status: true,
      message: 'Folder fetched succesfully',
      data: getAll,
    });
  } catch (error) {
    return res.status(error.status || 400).json({
      status: false,
      message: error.message,
    });
  }
};

// Delete Folder
exports.deleteFolder = async (req, res) => {
  try {
    const { folderid } = req.params;
    console.log(folderid);
    if (!mongoose.Types.ObjectId.isValid(folderid)) {
      throw new BadRequest('invalid folder id');
    }
    // eslint-disable-next-line camelcase
    const delete_folder = await Folder.findOneAndDelete({
      _id: folderid,
    });
    // eslint-disable-next-line camelcase
    if (!delete_folder) {
      throw new Unauthorized('Unable to delete this folder');
    }

    return res.status(200).json({
      status: true,
      message: 'Folder deleted succesfully',
    });
  } catch (error) {
    return res.status(error.status || 400).json({
      status: false,
      message: error.message,
    });
  }
};
