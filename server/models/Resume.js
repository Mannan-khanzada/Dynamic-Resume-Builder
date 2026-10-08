import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true
    },
    title: { type: String, default: "Untitled Resume", required: true },
    public: { type: Boolean, default: false },
    template: { type: String, default: 'classic' },
    accentColor: { type: String, default: '#3B82F6' },
    professionalSummary: { type: String, default: '' },
    skills: [{ type: String }],
    personalInfo: {
        image: { type: String, default: '' },
        full_name: { type: String, default: '' },
        profession: { type: String, default: '' },
        email: { type: String, default: '' },
        phone: { type: String, default: '' },
        location: { type: String, default: '' },
        linkedin: { type: String, default: '' },
        website: { type: String, default: '' }
    },

    experience: [{
        company: { type: String, default: '' },
        position: { type: String, default: '' },
        startDate: { type: String, default: '' },
        endDate: { type: String, default: '' },
        description: { type: String, default: '' },
        isCurrent: { type: Boolean, default: false }
        }],

        projects: [{
        name: { type: String, default: '' },
        type: { type: String, default: '' },
        description: { type: String, default: '' },
        }],

    education: [{
        institution: { type: String, default: '' },
        degree: { type: String, default: '' },
        fieldOfStudy: { type: String, default: '' },
        startDate: { type: String, default: '' },
        endDate: { type: String, default: '' },
        description: { type: String, default: '' },
        isCurrent: { type: Boolean, default: false }
        }]
}, { timestamps: true, minimize: false });


const Resume = mongoose.model('Resume', ResumeSchema);

export default Resume;
