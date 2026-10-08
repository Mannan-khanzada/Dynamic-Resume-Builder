import mongoose from 'mongoose';
import dns from 'dns';

// System/ISP ka DNS resolve nahi kar pa raha SRV records,
// isliye Google DNS servers manually set kar rahe hain
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => {
            console.log('MongoDB connected successfully');
        });

        let mongodbURI = process.env.MONGODB_URI;
        const projectName = process.env.MONGODB_DATABASE || 'Resume-Builder';

        if (!mongodbURI) {
            throw new Error('MongoDB credentials are not set in environment variables');
        }

        if (mongodbURI.endsWith('/')) {
            mongodbURI = mongodbURI.slice(0, -1);
        }

        await mongoose.connect(`${mongodbURI}/${projectName}`);

    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;