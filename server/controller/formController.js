import formModel from "../models/formModel.js";

export const getFormData = async (req, res) => {
  const userId = req.user.id;
  const form = await formModel.findOne({ userId });
  res.json(form || {});
};

export const saveFormData = async (req, res) => {
  try {
    const { userId, personalInfo, education, projects } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    // then create or update the form document
    let form = await formModel.findOne({ userId });
    if (form) {
      form.personalInfo = personalInfo;
      form.education = education;
      form.projects = projects;
    } else {
      form = new Form({ userId, personalInfo, education, projects });
    }
    await form.save();

    res.status(200).json({ message: "Form saved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

