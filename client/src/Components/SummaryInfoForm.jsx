import { Loader2, Sparkles } from 'lucide-react';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import api from '../configs/api';

const MAX_CHARS = 400;
const MAX_LINES = 5;

const SummaryInfoForm = ({ data, onChange }) => {
    const { token } = useSelector(state => state.auth);
    const [isEnhancing, setIsEnhancing] = useState(false);

    const handleEnhance = async () => {
        if (!data || !data.trim()) {
            toast.error("Write a draft summary first, then enhance it with AI.");
            return;
        }
        setIsEnhancing(true);
        try {
            const { data: res } = await api.post(
                '/api/ai/enhance-pro-sum',
                { userContent: data },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            onChange(res.enhancedSummary);
            toast.success("Summary enhanced!");
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message || "Failed to enhance summary");
        } finally {
            setIsEnhancing(false);
        }
    };

    return (
        <div className='space-y-4'>
            <div className='flex items-center justify-between'>
                <div>
                    <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>
                        Professional Summary
                    </h3>
                    <p className='text-sm text-gray-500'>
                        Add summary for your resume here
                    </p>
                </div>
                <button 
                    className='flex items-center gap-2 px-3 py-1 text-sm bg-brand-purple-100 text-brand-purple-700 rounded hover:bg-brand-purple-200 transition-colors disabled:opacity-50'
                    onClick={handleEnhance}
                    disabled={isEnhancing}
                    type="button"
                >
                    {isEnhancing ? <Loader2 className='w-4 h-4 animate-spin' /> : <Sparkles className='w-4 h-4' />}
                    {isEnhancing ? 'Enhancing...' : 'Auto Generate'}
                </button>
            </div>
            <div className='mt-6'>
                <label htmlFor="professional-summary" className="sr-only">Professional Summary</label>
                <textarea
                    id="professional-summary"
                    value={data || ""}
                    rows={7}
                    onChange={(e) => {
                        let value = e.target.value;

                        if (value.length > MAX_CHARS) value = value.substring(0, MAX_CHARS);

                        let lines = value.split("\n");
                        if (lines.length > MAX_LINES) {
                            lines = lines.slice(0, MAX_LINES);
                            value = lines.join("\n");
                        }

                        onChange(value);
                    }}
                    className="w-full p-3 px-4 mt-2 border text-sm border-gray-300 rounded-lg focus:ring focus:ring-brand-blue-500 focus:border-brand-blue-500 outline-none text-gray-500 transition-colors resize-none"
                    placeholder="Write a compelling professional summary that highlights your key strengths and career objectives..."
                />
                <p className='text-xs text-gray-500 max-w-4/5 mt-2 ml-10 text-center'>
                    Tip: Keep it concise (3-4 sentences) and focus on your most relevant achievements and skills.
                </p>
            </div>
        </div>
    );
}

export default SummaryInfoForm;
