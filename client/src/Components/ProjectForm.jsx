import React from 'react'
import { Loader2, Plus, Sparkles, Trash2 } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import api from "../configs/api";

const ProjectForm = ({ data, onChange }) => {
    const { token } = useSelector(state => state.auth)
    const [enhancingIndex, setEnhancingIndex] = useState(null)

    const enhanceDescription = async (index) => {
        const current = data[index].description
        if (!current || !current.trim()) {
            toast.error("Write a draft description first, then enhance it with AI.")
            return
        }
        setEnhancingIndex(index)
        try {
            const { data: res } = await api.post(
                '/api/ai/enhance-job-desc',
                { userContent: current },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            updateProject(index, 'description', res.enhancedJobDesc)
            toast.success("Description enhanced!")
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message || "Failed to enhance description")
        } finally {
            setEnhancingIndex(null)
        }
    }

     const addProject = () => {
        const newProject = {
            name: '',
            type: '',
            description: '',
        };
        onChange([...data, newProject])
    }

    const removeProject = (index) => {
        const updated = data.filter((_, i) => i !== index);
        onChange(updated);
    }

    const updateProject = (index, field, value) => {
        const updated = data.map((exp, i) =>
            i === index ? { ...exp, [field]: value } : exp
        );
        onChange(updated);
    }
  return (
     <div className='space-y-6'>
            <div className='flex items-center justify-between'>
                <div>
                    <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>
                        Projects
                    </h3>
                    <p className='text-sm text-gray-500'>
                        Add your Projects details
                    </p>
                </div>
                <button onClick={addProject}
                    className='flex items-center gap-2 px-3 py-1 text-sm bg-brand-green-100 text-brand-green-700 rounded hover:bg-brand-purple-200 transition-colors disabled:opacity-50'>
                    <Plus className='w-4 h-4' />
                    Add Project
                </button>
            </div>
            
                <div className='space-y-4 mt-6'>
                    {data.map((project, index) => (
                        <div key={index} className='border p-4 rounded-lg space-y-3 border-gray-300'>
                            <div className='flex justify-between items-start'>
                                <h4> Project # {index + 1} </h4>
                                <button className='text-red-500 hover:text-red-700 
                                transition-colors' onClick={() => removeProject(index)} >
                                    <Trash2 className='size-4' />

                                </button>
                            </div>
                            <div className='grid  gap-4'>
                                <input type='text' value={project.name || ""}
                                    onChange={(e) => updateProject(index, 'name', e.target.value)}
                                    placeholder='Project Name'
                                    className='px-3 py-2 text-sm rounded-lg'
                                />

                                <input type='text' value={project.type || ""}
                                    onChange={(e) => updateProject(index, 'type', e.target.value)}
                                    placeholder='Project Type'
                                    className='px-3 py-2 text-sm rounded-lg'
                                />

                            </div>
                           
                            <div className='space-y-2'>
                                <div className='flex items-center justify-between'>
                                    <label className='text-sm font-medium text-gray-700'>
                                        Description
                                    </label>
                                    <button type="button" onClick={() => enhanceDescription(index)} disabled={enhancingIndex === index} className='flex items-center gap-1 px-2 py-1 text-xs bg-brand-purple-100
                                    text-brand-purple-700 rounded hover:bg-brand-purple-200 transition-colors disabled:opacity-50'>
                                        {enhancingIndex === index ? <Loader2 className='w-4 h-4 text-brand-purple-600 inline-block ml-2 animate-spin' /> : <Sparkles className='w-4 h-4 text-brand-purple-600 inline-block ml-2' />}
                                        {enhancingIndex === index ? 'Enhancing...' : 'Enhance with AI'}
                                    </button>
                                </div>
                                <textarea value={project.description || ""}
                                    onChange={(e) => updateProject(index, "description", e.target.value)}
                                    rows={4} className='w-full text-sm px-3 py-2 rounded-lg resize-none'
                                    placeholder='Describe your project details and achievements' />
                            </div>
                        </div>
                    ))}
                </div>
           
        </div>
  )
}

export default ProjectForm
