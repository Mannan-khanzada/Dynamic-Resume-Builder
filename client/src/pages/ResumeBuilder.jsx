import React from 'react'
import { useEffect, useState } from 'react';
// import { dummyResumeData } from '../assets/assets';
import api from '../configs/api'
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeftIcon, Briefcase, Check, ChevronLeft, ChevronRight,
  DownloadIcon,
  EyeIcon,
  EyeOffIcon,
  FileText, FolderIcon, GraduationCap, Share2Icon, Sparkles, User
} from 'lucide-react';
import PersonalInfoForm from '../Components/PersonalInfoForm';
import toast from "react-hot-toast";
import ResumePreview from '../Components/ResumePreview';
import TemplateSelector from '../Components/TemplateSelector';
import ColorPicker from '../Components/ColorPicker';
import SummaryInfoForm from '../Components/SummaryInfoForm';
import ExperienceForm from '../Components/ExperienceForm';
import EducationForm from '../Components/EducationForm';
import ProjectForm from '../Components/ProjectForm';
import SkillsForm from '../Components/SkillsForm';
import { useSelector } from 'react-redux';

const ResumeBuilder = () => {
  const { resumeId } = useParams();

  const { token } = useSelector(state => state.auth)

  const loadExistingResume = async () => {
    try {
      const { data } = await api.get(`/api/resumes/${resumeId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (data.resume) {
        setResumeData(data.resume)
        document.title = data.resume.title;
      }
    } catch (error) {
      console.log(error?.response?.data?.message || error.message)

    }
  }



  // Corrected spelling in state keys for better maintainability
  const [resumeData, setResumeData] = useState({
    id: '',
    title: '',
    personalInfo: {},
    professionalSummary: '',
    experience: [],
    education: [],
    skills: [],
    projects: [],
    template: "classic",   // <-- correct key
    accentColor: "#3b82f6",
    public: false,
  });



  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [removeBackground, setRemoveBackground] = useState(false);

  const Sections = [
    { id: 'personalInfo', title: 'Personal Information', icon: User },
    { id: 'summary', title: 'Summary', icon: FileText },
    { id: 'experience', title: 'Experience', icon: Briefcase },
    { id: 'education', title: 'Education', icon: GraduationCap },
    { id: 'projects', title: 'Projects', icon: FolderIcon },
    { id: 'skills', title: 'Skills', icon: Sparkles },
  ];

  const activeSection = Sections[activeSectionIndex];

  useEffect(() => {
    loadExistingResume()
  }, [resumeId]);

  // Handler to clean up the render method
  const handleNext = () => {
    setActiveSectionIndex((prev) => Math.min(prev + 1, Sections.length - 1));
  };

  const handlePrevious = () => {
    setActiveSectionIndex((prev) => Math.max(prev - 1, 0));
  };

  // Scalable way to render form content
  const renderActiveSection = () => {
    switch (activeSection.id) {
      case 'personalInfo':
        return (
          <PersonalInfoForm
            data={resumeData.personalInfo}
            onChange={(data) => setResumeData(prev => ({
              ...prev,
              personalInfo: data
            }))}
            removeBackground={removeBackground}
            setRemoveBackground={setRemoveBackground}
          />
        );
      case 'summary':
        return (
          <SummaryInfoForm
            data={resumeData.professionalSummary}
            onChange={(data) => setResumeData(prev => ({
              ...prev,
              professionalSummary: data
            }))}
            setResumeData={setResumeData}
          />
        );

      case 'experience':
        return (
          <ExperienceForm
            data={resumeData.experience}
            onChange={(data) => setResumeData(prev => ({
              ...prev,
              experience: data
            }))}
          />
        );

      case 'education':
        return (
          <EducationForm
            data={resumeData.education}
            onChange={(data) => setResumeData(prev => ({
              ...prev,
              education: data
            }))}
          />
        );
      case 'projects':
        return (
          <ProjectForm
            data={resumeData.projects}
            onChange={(data) => setResumeData(prev => ({
              ...prev,
              projects: data
            }))}
          />
        );

      case 'skills':
        return (
          <SkillsForm
            data={resumeData.skills}
            onChange={(data) => setResumeData(prev => ({
              ...prev,
              skills: data
            }))}
          />
        );
      default:
        return <div className="p-4 text-gray-500">Select a section</div>;
    }
  };

  const changeResumeVisibility = async () => {
    try {
      const updated = !resumeData.public;

      await api.put('/api/resumes/update', {
        resumeId,
        resumeData: {
          ...resumeData,
          public: updated
        }
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setResumeData(prev => ({ ...prev, public: updated }));

    } catch (error) {
      console.log(error?.response?.data?.message || error.message);
    }
  };

  const handleShare = () => {
    const frontendUrl = window.location.href.split('/app/')[0];
    const resumeUrl = frontendUrl + `/view/${resumeId}`;
    if (navigator.share) {
      navigator.share({ url: resumeUrl, text: "My Resume", })
    } else {
      alert('share not supported on this browser');
    }
  };

  const DownloadResume = () => {
    window.print();
  }


const saveResume = async () => {
  try {
    // Clone current state
    const updatedResume = structuredClone(resumeData);

    // Agar image File hai, FormData me bhejo aur JSON me remove karo
    let imageFile = null;
    if (updatedResume.personalInfo.image instanceof File) {
      imageFile = updatedResume.personalInfo.image;
      delete updatedResume.personalInfo.image;
    }

    const formData = new FormData();
    formData.append('resumeId', resumeId);
    formData.append('resumeData', JSON.stringify(updatedResume));
    if (imageFile) formData.append('image', imageFile);
    if (removeBackground) formData.append('removeBackground', 'yes');

    const { data } = await api.put('/api/resumes/update', formData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Merge backend response properly
    setResumeData(prev => ({
      ...prev,
      ...data.resume,
      personalInfo: { ...data.resume.personalInfo },
      experience: [...(data.resume.experience || [])],
      education: [...(data.resume.education || [])],
      skills: [...(data.resume.skills || [])],
      projects: [...(data.resume.projects || [])],
    }));

    toast.success(data.message);
  } catch (err) {
    console.log('Error Saving resume', err);
    toast.error("Failed to save resume");
  }
};

  //   const saveChanges = async () => {
  //   try {
  //     const { data } = await api.put(
  //       '/api/resumes/update',
  //       {
  //         resumeId,
  //         resumeData
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`
  //         }
  //       }
  //     );

  //     setResumeData(data.resume); // update state with latest saved data
  //     alert("Resume saved successfully!");
  //   } catch (error) {
  //     console.log(error?.response?.data?.message || error.message);
  //     alert("Failed to save resume.");
  //   }
  // };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <div className='max-w-7xl mx-auto px-4 py-6'>
        <Link
          to={'/app'}
          className='inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-all'
        >
          <ArrowLeftIcon className='size-4' />
          Back to Dashboard
        </Link>
      </div>

      <div className='max-w-7xl mx-auto px-4 pb-8'>
        <div className='grid lg:grid-cols-12 gap-8'>

          {/* Left Side Panel (Form Area) */}
          <div className='relative lg:col-span-5 rounded-lg'>
            <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 pt-1 overflow-hidden relative'>

              {/* Progress Bar */}
              <div className='absolute top-0 left-0 right-0 h-1 bg-gray-100'>
                <div
                  className='h-full bg-linear-to-r from-brand-green-500 to-brand-green-600 transition-all duration-500 ease-out'
                  style={{ width: `${(activeSectionIndex / (Sections.length - 1)) * 100}%` }}
                />
              </div>

              {/* Form Navigation Header */}
              <div className="flex items-center gap-2 text-gray-700 font-semibold mt-4">
                <activeSection.icon className="size-5 text-brand-blue-600" />
                {activeSection.title}
              </div>
              <div className='flex justify-between items-center mb-6 border-b border-gray-400 py-4 mt-2'>

                <div className="flex items-center gap-2">
                  <TemplateSelector
                    selectedTemplate={resumeData.template}
                    onChange={(template) => {
                      console.log("Selected Template =>", template); // log the clicked template
                      setResumeData(prev => ({ ...prev, template }));
                    }}
                  />
                  <ColorPicker selectedColor={resumeData.accentColor} onChange={(color) => setResumeData(prev => ({
                    ...prev, accentColor: color
                  }))} />
                </div>

                <div className='flex items-center gap-2'>
                  <button
                    onClick={handlePrevious}
                    className={`flex items-center gap-1 p-2 rounded-lg text-sm font-medium transition-all
                      ${activeSectionIndex === 0
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-600 hover:bg-gray-300'}`
                    }
                    disabled={activeSectionIndex === 0}
                  >
                    <ChevronLeft className='size-4' />
                    Previous
                  </button>

                  {activeSectionIndex === Sections.length - 1 ? (
                    <button
                      onClick={() => toast.promise(saveResume(), {
                        loading: 'Saving...',
                        success: 'Resume saved!',
                        error: 'Failed to save resume',
                      })}
                      className='flex items-center gap-1 p-2 px-3 rounded-lg text-sm font-medium transition-all
                        bg-brand-green-600 text-white hover:bg-brand-green-700 shadow-sm'
                    >
                      Finish &amp; Save
                      <Check className='size-4' />
                    </button>
                  ) : (
                    <button
                      onClick={handleNext}
                      className='flex items-center gap-1 p-2 px-3 rounded-lg text-sm font-medium transition-all
                        bg-brand-blue-600 text-white hover:bg-brand-blue-700 shadow-sm'
                    >
                      Next
                      <ChevronRight className='size-4' />
                    </button>
                  )}
                </div>
              </div>

              {/* Active Form Content */}
              <div className='space-y-6 min-h-[300px]'>
                {renderActiveSection()}
              </div>
              <button onClick={() => toast.promise(saveResume(), {
                loading: 'Saving...',
                success: 'Resume saved!',
                error: 'Failed to save resume',
              })}
                className='bg-linear-to-br from-brand-green-200 to-brand-green-300
              ring-brand-green-400 text-brand-green-600 ring ring:hover:ring-brand-green-500 px-4 py-2 rounded-lg mt-6 
              text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed'>
                Save Changes
              </button>
            </div>
          </div>

          {/* Right Side Panel (Preview Placeholder) */}
          <div className='lg:col-span-7 max-lg:mt-6'>
            <div className='relative w-full'>
              <div className='absolute bottom-3 left-0 right-0 flex items-center
            justify-end gap-2'>

                {/* Future action buttons for preview (e.g., Download, Share) can be added here */
                  resumeData.public && (
                    <button onClick={handleShare} className='flex items-center gap-2 p-2 px-4  text-sm bg-brand-blue-100
                 text-brand-blue-700 rounded hover:bg-brand-blue-200 transition-colors'>
                      <Share2Icon className='w-4 h-4' />
                      Published
                    </button>
                  )}
                <button onClick={changeResumeVisibility} className='flex items-center p-2 px-4 gap-2 text-xs bg-linear-to-br
                from-brand-purple-200 to-brand-purple-300 text-brand-purple-600
                 ring-brand-purple-300 rounded-lg hover:ring transition-colors
                '>
                  {resumeData.public ? <EyeIcon className='w-5 h-5' /> :
                    <EyeOffIcon className='w-5 h-5 ' />}
                  {resumeData.public ? "Public" : "Private"}
                </button>

                <button onClick={DownloadResume} className='flex items-center p-2 px-4 gap-2 text-xs bg-linear-to-br
                from-brand-green-200 to-brand-green-300 text-brand-green-600
                 ring-brand-green-300 rounded-lg hover:ring transition-colors
                '>
                  <DownloadIcon className='w-5 h-5 text-brand-green-500' /> Download
                </button>

              </div>
            </div>
            <ResumePreview data={resumeData} template={resumeData.template}
              accentColor={resumeData.accentColor} />

          </div>

        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;