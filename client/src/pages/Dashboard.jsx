import React from 'react'
import {
  FilePenLineIcon,
  LoaderCircleIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  UploadCloudIcon,
  XIcon,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from '../configs/api'
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import pdfToText from 'react-pdftotext';

const Dashboard = () => {
  const { user, token } = useSelector(state => state.auth);
  const colors = ["#9333ea", "#d97706", "#dc2626", "#0284c7", "#16a34a"];

  const [allResumes, setAllResumes] = useState([]);
  const [showCreateResume, setShowCreateResume] = useState(false);
  const [showUploadResume, setShowUploadResume] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [title, setTitle] = useState("");
  const [resume, setResume] = useState(null);
  const [editResumeId, setEditResumeId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // Load all resumes
  const loadAllResumes = async () => {
    try {
      const { data } = await api.get("/api/users/resumes", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAllResumes(data.resume);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    loadAllResumes();

  }, []);

  // Create Resume
  const createResume = async (event) => {
    event.preventDefault();
    try {
      const { data } = await api.post("/api/resumes/create",
        { title },
        { headers: { Authorization: `Bearer ${token}` } });
      setAllResumes(prev => [...prev, data.resume]);
      setTitle("");
      setShowCreateResume(false);
      navigate(`/app/builder/${data.resume._id}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  // Upload Resume
   // Upload Resume
  const uploadResume = async (event) => {
    event.preventDefault();
    if (!resume) {
      toast.error("Please select a PDF file first.");
      return;
    }
    setIsLoading(true);
    try {
      const resumeText = await pdfToText(resume);
      if (!resumeText || !resumeText.trim()) {
        toast.error("Couldn't read any text from this PDF. It may be a scanned/image-only file — try a text-based PDF instead.");
        setIsLoading(false);
        return;
      }
      const { data } = await api.post("/api/ai/upload-resume",
        { title, resumeText },
        { headers: { Authorization: `Bearer ${token}` } });
      setTitle("");
      setResume(null);
      setShowUploadResume(false);
      navigate(`/app/builder/${data.resumeId}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
    setIsLoading(false);
  };

  // Edit Title
  const editTitle = async (event) => {
    event.preventDefault();
    if (!title.trim()) return;

    const previousResumes = [...allResumes];
    setAllResumes(allResumes.map(r =>
      r._id === editResumeId ? { ...r, title } : r
    ));

    try {
      const { data } = await api.put(`/api/resumes/update`, {
        resumeId: editResumeId,
        resumeData: { title }
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(data.message);
    } catch (err) {
      setAllResumes(previousResumes); // rollback if API fails
      toast.error(err?.response?.data?.message || err.message);
    } finally {
      setEditResumeId('');
      setTitle('');
      setShowEditModal(false);
    }
  };

  // Delete Resume
  const deleteResume = async (resumeId) => {
    try {
      if (!window.confirm("Are you sure you want to delete this resume?")) return;
      const { data } = await api.delete(`/api/resumes/${resumeId}`, {
  headers: { Authorization: `Bearer ${token}` }
});
      setAllResumes(allResumes.filter(r => r._id !== resumeId));
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  return (
    <div>
      {/* <h1>Dashboard Page</h1> */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-2xl font-medium mb-6 bg-linear-to-r from-brand-indigo-700 to-brand-green-600 bg-clip-text text-transparent">
          Welcome {user?.name}
        </p>

        {/* Buttons */}
        <div className="flex gap-10">
          <button
            onClick={() => setShowCreateResume(true)}
            className="w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed group hover:border-brand-indigo-500 hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            <PlusIcon className="size-11 p-2.5 bg-linear-to-r from-brand-indigo-700 to-brand-green-600 text-white rounded-full" />
            <p className="text-sm group-hover:text-brand-indigo-600 transition-all duration-300">Create Resume</p>
          </button>

          <button
            onClick={() => setShowUploadResume(true)}
            className="w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed group hover:border-brand-indigo-500 hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            <UploadCloudIcon className="size-11 p-2.5 bg-linear-to-r from-brand-indigo-700 to-brand-green-600 text-white rounded-full" />
            <p className="text-sm group-hover:text-brand-indigo-600 transition-all duration-300">Upload Resume</p>
          </button>
        </div>

        <hr className="border-slate-400 my-6 sm:w-[330px]" />

        {/* Resume List */}
        <div className="grid grid-cols-2 sm:flex flex-wrap gap-4">
          {allResumes.map((resume, index) => {
            const baseColor = colors[index % colors.length];
            return (
              <button
                key={resume._id}
                onClick={() => navigate(`/app/builder/${resume._id}`)}
                className="relative w-full sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 border group hover:shadow-lg transition-all duration-300 cursor-pointer"
                style={{
                  background: `linear-gradient(135deg, ${baseColor}10, ${baseColor}40)`,
                  borderColor: baseColor + "40",
                }}
              >
                <FilePenLineIcon className="size-7 group-hover:scale-105 transition-all" style={{ color: baseColor }} />

                <p className="text-sm group-hover:scale-105 transition-all px-2 text-center" style={{ color: baseColor + "90" }}>
                  {resume.title}
                </p>

                <p className="text-xs text-slate-600">
                  Updated on {new Date(resume.updatedAt).toLocaleDateString()}
                </p>

                {/* Pencil / Trash */}
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-1 right-1 hidden group-hover:flex items-center gap-1"
                >
                  <TrashIcon
                    onClick={() => deleteResume(resume._id)}
                    className="size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors"
                  />
                  <PencilIcon
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditResumeId(resume._id);
                      setTitle(resume.title);
                      setShowEditModal(true); // open edit modal
                    }}
                    className="size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors"
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Create Resume Modal */}
        {showCreateResume && (
          <form
            onSubmit={createResume}
            onClick={() => setShowCreateResume(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6"
            >
              <h2 className="text-xl font-bold mb-4 "> Create a Resume </h2>
              <input
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                type="text"
                placeholder="Enter your resume title"
                className="w-full px-4 py-2 mb-4 focus:border-brand-green-600 ring-brand-green-600"
                required
              />
              <button className="w-full py-2 bg-brand-green-600 text-white rounded hover:bg-brand-green-700 transition-colors">
                Create Resume
              </button>
              <XIcon
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                onClick={() => { setShowCreateResume(false); setTitle(""); }}
              />
            </div>
          </form>
        )}

        {/* Edit Resume Modal (reuse same design as Create) */}
        {showEditModal && (
          <form
            onSubmit={editTitle}
            onClick={() => setShowEditModal(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6"
            >
              <h2 className="text-xl font-bold mb-4">Edit Resume Title</h2>
              <input
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                type="text"
                placeholder="Enter your resume title"
                className="w-full px-4 py-2 mb-4 focus:border-brand-green-600 ring-brand-green-600 "
                required
                autoFocus
              />
              <button
                type="submit"
                className="w-full py-2 bg-brand-green-600 text-white rounded hover:bg-brand-green-700 transition-colors"
              >
                Save
              </button>
              <XIcon
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                onClick={() => { setShowEditModal(false); setEditResumeId(''); setTitle(''); }}
              />
            </div>
          </form>
        )}

        {/* Upload Resume Modal */}
        {showUploadResume && (
          <form
            onSubmit={uploadResume}
            onClick={() => setShowUploadResume(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6"
            >
              <h2 className="text-xl font-bold mb-4 "> Upload Resume </h2>
              <input
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                type="text"
                placeholder="Enter your resume title"
                className="w-full px-4 py-2 mb-4 focus:border-brand-green-600 ring-brand-green-600"
                required
              />
              <div>
                <label
                  htmlFor="resume-input"
                  className="block text-sm text-slate-700"
                >
                  Select Resume File
                  <div
                    className="flex flex-col items-center justify-center gap-2 border text-slate-400 border-slate-400 border-dashed rounded-md py-10 p-4 my-4 hover:border-brand-green-500 hover:text-brand-green-700 cursor-pointer transition-colors"
                  >
                    {resume ? <p className="text-brand-green-700">{resume.name}</p> :
                      <>
                        <UploadCloudIcon className="size-14 stroke-1" />
                        <p>Upload Resume</p>
                      </>}
                  </div>
                </label>
                <input type="file" id="resume-input" accept=".pdf" hidden onChange={(e) => setResume(e.target.files[0])} />
              </div>
              <button
                className="w-full py-2 bg-brand-green-600 text-white rounded hover:bg-brand-green-700 transition-colors"
              >
                {isLoading && <LoaderCircleIcon className="animate-spin size-4 text-white" />}
                {isLoading ? 'Uploading...' : 'Upload Resume'}
              </button>
              <XIcon
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                onClick={() => { setShowUploadResume(false); setTitle(""); }}
              />
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

export default Dashboard;
