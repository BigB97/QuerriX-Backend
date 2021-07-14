/* eslint-disable consistent-return */
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
const icongen = require('../utils/icon');
const Workspace = require('../models/workspace.model');
const Folder = require('../models/folder.model');
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
      throw new CustomError(
        `${workspaceName} Workspace already exist, create with another name`,
        400
      );
    }
    // check if workspace name is empty
    if (!workspaceName) {
      throw new CustomError('Workspace name is required', 400);
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
        logo: {
          url: workspace_image.secure_url,
          cloud_id: workspace_image.public_id,
        },
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

// Update workspace
exports.updateWorkspace = async (req, res) => {
  try {
    // Get the workspace id,new name and new image
    const { workspace } = req.params;
    const { workspaceName, secondary, primary } = req.body;
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

    // Check if file didn't come with payload
    if (!file) {
      // update workspace
      const updateWorkspace = await Workspace.updateOne(
        { _id: workspace },
        {
          $set: {
            workspaceName,
            workspace_branding: {
              primary,
              secondary,
            },
          },
        }
      );
      if (!updateWorkspace) {
        throw new InternalServerError("Update operation wasn't succesful");
      }

      // Return sucess message
      return res.status(200).json({
        status: true,
        message: 'Workspace updated successfully',
      });
    }

    // upload to cloudinary and get generated link
    const image = await cloudinary.uploader.upload(file.path);

    // Then search the workspace for prev imageurl and delete
    const { cloud_id } = findWorkspace.workspace_branding.logo;
    if (cloud_id) {
      await cloudinary.uploader.destroy(cloud_id);
    }
    await unlinkAsync(req.file.path);
    // Delete the uploade file

    // update workspace
    const updateWorkspace = await Workspace.updateOne(
      { _id: workspace },
      {
        $set: {
          workspaceName,
          workspace_branding: {
            primary,
            secondary,
            logo: { url: image.secure_url, cloud_id: image.public_id },
          },
        },
      }
    );
    // check if workspace was updated
    if (!updateWorkspace) {
      throw new InternalServerError("Update operation wasn't succesful");
    }
    // Return sucess message
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
    });
  } catch (error) {
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
      throw new CustomError('Invalid workspace id', 401);
    }
    // check if folder name is empty
    if (!folder || folder.length < 1) {
      throw new CustomError('Please provide the folder name', 400);
    }

    const icon = await icongen(folder);
    // create folder
    const createFolder = await Folder.create({
      folder,
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

// Update workspace
exports.updateFolder = async (req, res) => {
  try {
    // Get the workspace id,new name and new image
    const { folder } = req.params;
    const { folderName } = req.body;
    const { file } = req;

    // Check if the workpace id is ObjectId
    if (!mongoose.Types.ObjectId.isValid(folder)) {
      throw BadRequest('invalid workspace id');
    }
    // Check if the Workspace name is valid
    if (!folderName) {
      throw BadRequest('Workspace name is required');
    }
    // Find the the folder for conditions
    const findFolder = await Folder.findOne({ _id: folder });

    // Check if the workspace is present in the DB
    if (!findFolder) {
      throw NotFound('workspace not found');
    }

    // Check if file didn't come with payload
    if (!file) {
      // update workspace
      const updateWorkspace = await Workspace.updateOne(
        { _id: workspace },
        {
          $set: {
            workspaceName,
            workspace_branding: {
              primary,
              secondary,
            },
          },
        }
      );
      if (!updateWorkspace) {
        throw new InternalServerError("Update operation wasn't succesful");
      }

      // Return sucess message
      return res.status(200).json({
        status: true,
        message: 'Workspace updated successfully',
      });
    }

    // upload to cloudinary and get generated link
    const image = await cloudinary.uploader.upload(file.path);

    // Then search the workspace for prev imageurl and delete
    const { cloud_id } = findWorkspace.workspace_branding.logo;
    if (cloud_id) {
      await cloudinary.uploader.destroy(cloud_id);
    }
    await unlinkAsync(req.file.path);
    // Delete the uploade file

    // update workspace
    const updateWorkspace = await Workspace.updateOne(
      { _id: workspace },
      {
        $set: {
          workspaceName,
          workspace_branding: {
            primary,
            secondary,
            logo: { url: image.secure_url, cloud_id: image.public_id },
          },
        },
      }
    );
    // check if workspace was updated
    if (!updateWorkspace) {
      throw new InternalServerError("Update operation wasn't succesful");
    }
    // Return sucess message
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
