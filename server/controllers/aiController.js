
import Resume from '../models/Resume.js'
import ai from '../configs/ai.js'

//Controller for enhancing resume professional summary using AI
//Post request to /api/ai/enhance-summary

export const enhanceSummary = async (req, res) => {
    try {
        const { userContent } = req.body;

        if (!userContent) {
            return res.status(400).json({ message: 'User content is required' });
        }


        const aiResponse = await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL || "gemini-1.5-pro",
            messages: [
                {
                    role: "system",
                    content: "You are expert in resume writing and enhancement. Your task is to take the user's input for a resume professional summary and enhance it to be more concise, impactful, and tailored for job applications. Focus on highlighting key skills, achievements, and experiences in a way that grabs the attention of recruiters. Ensure the enhanced summary is clear, compelling, and effectively communicates the user's value proposition to potential employers."
                },
                {
                    role: "user",
                    content: `Enhance the following resume professional summary:\n\n${userContent}\n\nMake it more concise, impactful, and tailored for job applications. Highlight key skills, achievements, and experiences in a way that grabs the attention of recruiters. Ensure the enhanced summary is clear, compelling, and effectively communicates the user's value proposition to potential employers.`
                }
            ],
        });

        const enhancedSummary = aiResponse.choices[0].message.content.trim();
        return res.status(200).json({ enhancedSummary });

    } catch (error) {
        console.error('Error enhancing summary:', error);
        res.status(500).json({ message: error.message });
    }
};

// Controller for enhancing a resume's Job description
// POST: /api/ai/enhance-job-desc

export const enhanceJobDescription = async (req, res) => {
    try {
        const { userContent } = req.body;

        if (!userContent) {
            return res.status(400).json({ message: 'User content is required' });
        }

        const aiResponse = await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL || "gemini-1.5-pro",
            messages: [
                {
                    role: "system",
                    content: "You are an expert in resume writing. Enhance the provided job description to be more impactful and professional."
                },
                {
                    role: "user",
                    content: `Enhance the following job description:\n\n${userContent}`
                }
            ],
        });

        const enhancedJobDesc = aiResponse.choices[0].message.content.trim();
        return res.status(200).json({ enhancedJobDesc });

    } catch (error) {
        console.error('Error enhancing job description:', error);
        res.status(500).json({ message: error.message });
    }
};

// Controller for Uploading a resume to the database
// POST: /api/ai/upload-resume

export const uploadResume = async (req, res) => {
    try {
        const { resumeText, title } = req.body;
        const userId = req.userId;

        if (!resumeText) {
            return res.status(400).json({ message: 'User content is required' });
        }

        const systemPrompt = "You are an expert AI Agent to extract data from resume."
        const userPrompt = `extract data from this resume: ${resumeText}
        Provide data in the following json format with no additional before
        or after
        {
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
        isCurrent: { type: Boolean, default: false }
        }]
        }
        `

        const aiResponse = await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL || "gemini-1.5-pro",
            messages: [
                {
                    role: "system",
                    content: systemPrompt
                },
                {
                    role: "user",
                    content: userPrompt
                }
            ],

            response_format: { type: 'json_object' }

        });

        const extractedData = aiResponse.choices[0].message.content.trim();
        const parsedData = JSON.parse(extractedData);
        const newResume = await Resume.create({ userId, title, ...parsedData })

        res.json({ resumeId: newResume._id });

    } catch (error) {
        console.error('Error enhancing job description:', error);
        res.status(500).json({ message: error.message });
    }
};