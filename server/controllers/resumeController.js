import imageKit from '../configs/imageKit.js';
import Resume from "../models/Resume.js";
import fs from 'fs';

// ✅ Create Resume
export const createResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { title } = req.body;

    const newResume = await Resume.create({ userId, title });

    return res.status(201).json({
      message: "Resume created successfully",
      resume: newResume
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Server error",
    });
  }
};

// ✅ Get ALL resumes of logged-in user
export const getUserResumes = async (req, res) => {
  try {
    const userId = req.userId;

    const resumes = await Resume.find({ userId }).sort({ updatedAt: -1 });

    return res.status(200).json({
      message: "Resumes fetched successfully",
      resumes
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Server error",
    });
  }
};

// ✅ Get SINGLE resume (PRIVATE)
export const getResumeById = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;

    const resume = await Resume.findOne(
      { _id: resumeId, userId },
      '-__v -createdAt -updatedAt'
    );

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    return res.status(200).json({
      message: "Resume retrieved successfully",
      resume
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Server error",
    });
  }
};

// ✅ Get PUBLIC resume
export const getPublicResume = async (req, res) => {
  try {
    const { resumeId } = req.params;

    const resume = await Resume.findOne({
      _id: resumeId,
      public: true
    });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    return res.status(200).json({
      message: "Public resume fetched",
      resume
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Server error",
    });
  }
};

// ✅ Update Resume
export const updateResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeData, resumeId, removeBackground } = req.body;

    const image = req.file;

    // resumeData arrives as a JSON string when sent via FormData (file upload flow),
    // but as an already-parsed object when sent as a plain JSON PUT request.
    let resumeDataCopy = typeof resumeData === 'string' ? JSON.parse(resumeData) : { ...resumeData };

    // ✅ Handle Image Upload
    if (image) {
      const imageBufferData = fs.createReadStream(image.path);

      const response = await imageKit.files.upload({
        file: imageBufferData,
        fileName: 'resume.png',
        folder: 'user-resumes',
        transformation: {
          pre: 'w-300, h-300, fo-face, z-0.75' + (removeBackground ? ', e-bgremove' : '')
        }
      });
      if (!resumeDataCopy.personalInfo) resumeDataCopy.personalInfo = {};
      resumeDataCopy.personalInfo.image = response.url;

      // clean up temp upload from multer's disk storage
      fs.unlink(image.path, () => {});
    }

    const updatedResume = await Resume.findOneAndUpdate(
      { _id: resumeId, userId },
      { $set: resumeDataCopy },
      { new: true, runValidators: true }
    );

    if (!updatedResume) {
      return res.status(404).json({ message: "Resume not found or unauthorized" });
    }

    return res.status(200).json({
      message: "Resume updated successfully",
      resume: updatedResume
    });

  } catch (error) {
    console.error("Error updating resume:", error);  // 'error' not 'err'
    return res.status(500).json({
      message: error.message || "Server error",
    });
  }
};

// ✅ Delete Resume
export const deleteResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;

    const deletedResume = await Resume.findOneAndDelete({
      _id: resumeId,
      userId,
    });

    if (!deletedResume) {
      return res.status(404).json({
        message: "Resume not found or unauthorized"
      });
    }

    return res.status(200).json({
      message: "Resume deleted successfully",
      resume: deletedResume
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message || "Server error",
    });
  }
};


