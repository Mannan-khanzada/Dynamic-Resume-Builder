import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeftIcon, Loader } from 'lucide-react';
import ResumePreview from '../Components/ResumePreview';
import api from '../configs/api';
import { useSelector } from 'react-redux';

const Preview = () => {
  const { resumeId } = useParams();
  const { token } = useSelector(state => state.auth);
  
  const [isLoading, setIsLoading] = useState(true);
  const [resumeData, setResumeData] = useState(null);

  useEffect(() => {
    const loadResumeData = async () => {
      try {
        const { data } = await api.get(`/api/resumes/public/${resumeId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });

        if (data.resume) {
          setResumeData({
            id: data.resume._id,
            title: data.resume.title,
            personalInfo: data.resume.personalInfo,
            professionalSummary: data.resume.professionalSummary,
            experience: data.resume.experience,
            education: data.resume.education,
            skills: data.resume.skills,
            projects: data.resume.projects,
            template: data.resume.template,
            accentColor: data.resume.accentColor,
            public: data.resume.public,
          });
          document.title = `Preview - ${data.resume.title}`;
        } else {
          setResumeData(null);
          document.title = "Resume Not Found";
        }
      } catch (error) {
        console.error(error);
        setResumeData(null);
        document.title = "Resume Not Found";
      } finally {
        setIsLoading(false);
      }
    };

    loadResumeData();
  }, [resumeId, token]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="w-12 h-12 text-gray-400 animate-spin" />
      </div>
    );
  }

  if (!resumeData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-500">
        <p className="text-center text-3xl font-medium">Resume not found or inaccessible.</p>
        <Link
          to="/"
          className="mt-6 bg-brand-green-500 hover:bg-brand-green-600 text-white rounded-full px-6 py-2 flex items-center gap-2 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Back Home
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-100 min-h-screen py-10">
      <div className="max-w-3xl mx-auto p-8 bg-white shadow-md rounded-lg">
        <ResumePreview
          data={resumeData}
          template={resumeData.template}
          accentColor={resumeData.accentColor}
        />
      </div>
    </div>
  );
};

export default Preview;