import mongoose from 'mongoose';

const formSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  personalInfo: {
    name: String,
    email: String,
    address1: String,
    address2: String,
    city: String,
    state: String,
    zipcode: String,
  },
  education: {
    isStudying: Boolean,
    institution: String,
  },
  projects: [
    {
      name: String,
      description: String,
    }
  ]
});

export default mongoose.model('Form', formSchema);
