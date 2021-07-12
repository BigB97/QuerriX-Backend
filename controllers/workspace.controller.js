/* eslint-disable no-console */
/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const {
  BadRequest,
  NotFound,
  InternalServerError,
  Unauthorized,
} = require('http-errors');
const fs = require('fs');
const { promisify } = require('util');

const unlinkAsync = promisify(fs.unlink);

const alphabcg = require('alphabcg');
const cloudinary = require('cloudinary');
const Workspace = require('../models/workspace.model');
const Folder = require('../models/folder');
const CustomError = require('../utils/custom-error');
const sendEmail = require('../services/mail.service');
// const { uploadFile, getFileStream } = require('../utils/s3');

// creating workspace
exports.createWorkspace = async (req, res) => {
  try {
    // Get workspace name from paayload
    const { workspaceName } = req.body;
    const owner = req.user._id;
    // Find Workspace name for conditions
    const findWorkspace = await Workspace.findOne({
      owner: req.user.id,
      workspaceName,
    });
    // Check if workspace already exist
    if (findWorkspace) {
      throw CustomError(
        `${workspaceName} Workspace already exist, create with another name`,
        400
      );
    }
    // check if workspace name is empty
    if (!workspaceName) {
      throw CustomError('Workspace name is required', 400);
    }

    // options for workspace-image
    const option = {
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
    };

    // Create WorkSpaceImage from Workspacename
    const workspace_image = await alphabcg(workspaceName, option);

    // Create Worckspace name with image,brand-color,logo
    const workspace = await Workspace.create({
      workspaceName,
      owner,
      workspace_branding: {
        primary: '#FFFFFF',
        secondary: '#000000',
        logo: { url: workspace_image },
      },
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
    // return error message
    return res.status(error.status || 400).json({
      status: false,
      message: error.message,
    });
  }
};
// Creating folders in workspace
exports.createFolder = async (req, res) => {
  try {
    // receive folder name from request
    const { folder } = req.body;
    // receive workspace id from payload
    const { workspace } = req.params;

    // check if workspace id is valid
    if (!mongoose.Types.ObjectId.isValid(workspace)) {
      throw CustomError('Invalid workspace id', 401);
    }
    // check if folder name is empty
    if (!folder || folder.length < 1) {
      throw CustomError('Please provide the folder name', 400);
    }
    // create folder
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

// Update workspace
exports.updateWorkspace = async (req, res) => {
  try {
    // Get the workspace id,new name and new image
    const { workspace } = req.params;
    const { workspaceName } = req.body;
    const { file } = req;

    // Check if the workpace id is ObjectId
    if (!mongoose.Types.ObjectId.isValid(workspace)) {
      throw BadRequest('invalid workspace id');
    }
    // Check if the Workspace name is valid
    if (!workspaceName) {
      throw BadRequest('Workspace name is required');
    }
    // Find the the workspace for conditions
    const findWorkspace = await Workspace.findOne({ owner: req.user._id });

    // Check if the workspace is present in the DB
    if (!findWorkspace) {
      throw NotFound('workspace not found');
    }

    // upload to cloudinary and get generated link
    const image = await cloudinary.uploader.upload(file.path);
    console.log(image.secure_url);

    // Check if payload comes with image
    if (file) {
      // Then search the workspace for prev imageurl and delete
      const { cloud_id } = findWorkspace.workspace_branding.logo;
      if (findWorkspace.workspace_branding.logo.cloudid) {
        await cloudinary.uploader.destroy(cloud_id);
      }
    }

    await unlinkAsync(req.file.path);

    // update workspace
    const updateWorkspace = await Workspace.updateOne(
      { _id: workspace },
      {
        $set: {
          workspaceName,
          workspace_branding: {
            logo: { url: image.secure_url, cloud_id: image.public_id },
          },
        },
      }
    );
    console.log(updateWorkspace);
    if (!updateWorkspace) {
      throw InternalServerError("Update operation wasn't succesful");
    }
    // Delete the uploade file

    // Return sucess message
    return res.status(200).json({
      status: true,
      message: 'Workspace updated successfully',
    });
  } catch (error) {
    console.log(error);
    return res.status(error.status || 400).json({
      status: false,
      message: error.message,
    });
  }
};

// Get all workspace
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

// Delete Workspace
exports.deleteWorkspace = async (req, res) => {
  try {
    const { workspace } = req.params;
    if (!mongoose.Types.ObjectId.isValid(workspace)) {
      throw BadRequest('invalid workspace id');
    }
    // eslint-disable-next-line camelcase
    const delete_workspace = await Workspace.findOneAndDelete({
      owner: req.user._id,
    });
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

exports.inviteMember = async (req, res) => {
  try {
    const { email } = req.body;
    const member = await Workspace.findOne({ workspace_member: email });
    console.log(member);
    if (member) {
      throw new CustomError('Member already invited, check the workspace team');
    }
    const link = `www.qurioux.com/invite/:${member._id}${email}`;
    await sendEmail(
      email,
      'You have been invited ',
      'invite',
      {
        link,
        owner: member.owner.firstname,
        workspaceName: member.workspaceName,
      },
      (err, data) => {
        if (err) return err;
        return data;
      }
    );
  } catch (error) {
    return res.status(error.status || 400).json({
      status: false,
      message: error.message,
    });
  }
};
