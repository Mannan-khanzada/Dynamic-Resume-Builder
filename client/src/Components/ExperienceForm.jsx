import { Briefcase, Loader2, Plus, Sparkles, Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import api from '../configs/api'

const ExperienceForm = ({ data, onChange }) => {
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
            updateExperience(index, 'description', res.enhancedJobDesc)
            toast.success("Description enhanced!")
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message || "Failed to enhance description")
        } finally {
            setEnhancingIndex(null)
        }
    }

    const addExperience = () => {
        const newExperience = {
            company: '',
            position: '',
            startDate: '',
            endDate: '',
            description: '',
            isCurrent: false,
        };
        onChange([...data, newExperience])
    }

    const removeExperience = (index) => {
        const updated = data.filter((_, i) => i !== index);
        onChange(updated);
    }

    const updateExperience = (index, field, value) => {
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
                        Professional Experience
                    </h3>
                    <p className='text-sm text-gray-500'>
                        Add your job experience
                    </p>
                </div>
                <button onClick={addExperience}
                    className='flex items-center gap-2 px-3 py-1 text-sm bg-brand-green-100 text-brand-green-700 rounded hover:bg-brand-purple-200 transition-colors disabled:opacity-50'>
                    <Plus className='w-4 h-4' />
                    Add Experience
                </button>
            </div>
            {data.length === 0 ? (
                <div className='text-center py-8 text-gray-500'>
                    <Briefcase className='w-8 h-8 mx-auto mb-3 text-gray-300' />
                    <p>No experience added yet.</p>
                    <p className='text-sm'>Click "Add Experience" to get started.</p>
                </div>
            ): (
                <div className='space-y-4'>
                    {data.map((experience, index) => (
                        <div key={index} className='border p-4 rounded-lg space-y-3 border-gray-300'>
                            <div className='flex justify-between items-start'>
                                <h4> Experience # {index + 1} </h4>
                                <button className='text-red-500 hover:text-red-700 
                                transition-colors' onClick={() => removeExperience(index)} >
                                    <Trash2 className='size-4' />
                                </button>
                            </div>
                            <div className='grid grid-cols-2 md:grid-cols-2 gap-4'>
                                <input type='text' value={experience.company || ""}
                                    onChange={(e) => updateExperience(index, 'company', e.target.value)}
                                    placeholder='Company Name'
                                    className='px-3 py-2 text-sm rounded-lg'
                                />

                                <input type='text' value={experience.position || ""}
                                    onChange={(e) => updateExperience(index, 'position', e.target.value)}
                                    placeholder='Job Title/Position'
                                    className='px-3 py-2 text-sm rounded-lg'
                                />

                                <input type='month' value={experience.startDate || ""}
                                    onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                                    className='px-3 py-2 text-sm rounded-lg'
                                />

                                <input type='month' disabled={experience.isCurrent} value={experience.endDate || ""}
                                    onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                                    className='px-3 py-2 text-sm rounded-lg disabled:bg-gray-100'
                                />
                            </div>
                            <label>
                                <input type="checkbox" checked={experience.isCurrent || false}
                                    onChange={(e) => updateExperience(index, 'isCurrent', e.target.checked ? true : false)}
                                    className='rounded boreder-gray-300 text-brand-blue-600 focus:ring-brand-blue-500' />
                                <span className="ml-2 text-sm text-gray-700">I currently work here</span>
                            </label>

                            <div className='space-y-2'>
                                <div className='flex items-center justify-between'>
                                    <label className='text-sm font-medium text-gray-700'>
                                        Job Description
                                    </label>
                                    <button type="button" onClick={() => enhanceDescription(index)} disabled={enhancingIndex === index} className='flex items-center gap-1 px-2 py-1 text-xs bg-brand-purple-100
                                    text-brand-purple-700 rounded hover:bg-brand-purple-200 transition-colors disabled:opacity-50'>
                                        {enhancingIndex === index ? <Loader2 className='w-4 h-4 text-brand-purple-600 inline-block ml-2 animate-spin' /> : <Sparkles className='w-4 h-4 text-brand-purple-600 inline-block ml-2' />}
                                        {enhancingIndex === index ? 'Enhancing...' : 'Enhance with AI'}
                                    </button>
                                </div>
                                <textarea value={experience.description || ""}
                                onChange={(e)=> updateExperience(index, "description", e.target.value)}
                                rows={4} className='w-full text-sm px-3 py-2 rounded-lg resize-none' 
                               placeholder='Describe your key responsibilities and achivements...' />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ExperienceForm
