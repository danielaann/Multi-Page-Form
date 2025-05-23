import React, { useState } from 'react';
import { useFormStore } from '../store/formStore';
import { assets } from '../assets/assets';
import { getFormData, saveFormData } from '../Api/formApi';
import { useEffect } from 'react';



const Form = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { setPersonalInfo, setEducation, setProjects } = useFormStore();

  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, 3));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getFormData();
        if (data.personalInfo) setPersonalInfo(data.personalInfo);
        if (data.education) setEducation(data.education);
        if (data.projects) setProjects(data.projects);
      } catch (err) {
        console.error(err.message);
      }
    };
    loadData();
  }, []);


  const handleSubmit = async () => {
  const state = useFormStore.getState(); // ✅ Correct way to access store outside render
  

  try {
    const { personalInfo, education, projects } = useFormStore.getState(); // use getState()
    const userId = localStorage.getItem('userId');
    
  if (!userId) {
    alert("User ID not found. Please log in or try again.");
    return;
  }
    const data = {
  userId,
  personalInfo,
  education,
  projects
};



    console.log("Submitting data:", data); // DEBUG LOG

    await saveFormData(data);

    alert("Form submitted successfully!");
  } catch (error) {
    console.error("Error submitting form:", error);
    alert("Submission failed.");
  }
};



  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 ">
      <img
        src={assets.logo}
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />
      <div className="bg-slate-900 m-5 p-10 rounded-lg shadow-lg w-full sm:w-[40rem] text-indigo-300 text-sm">
        <h1 className="text-3xl font-semibold text-white text-center mb-3">Multi-Page Form</h1>
        <div className="relative">
          <div className="flex justify-center mb-6">
            <div className="flex space-x-2">
              {[1, 2, 3].map((page) => (
                <div
                  key={page}
                  className={`h-2 w-2 rounded-full transition-all duration-300 ${currentPage === page ? 'bg-indigo-500 scale-125' : 'bg-gray-600'
                    }`}
                />
              ))}
            </div>
          </div>
          {currentPage === 1 && <PersonalInfoForm />}
          {currentPage === 2 && <EducationForm />}
          {currentPage === 3 && <ProjectsForm />}
        </div>
        <div className="flex justify-between mt-8">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className={`w-[48%] py-2.5 rounded-full font-medium text-white transition-all duration-200 ${currentPage === 1
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-500 to-indigo-900 hover:from-indigo-600 hover:to-indigo-950'
              }`}
          >
            Previous
          </button>
          <button
            onClick={currentPage === 3 ? handleSubmit : nextPage}
            disabled={false}
            className={`w-[48%] py-2.5 rounded-full font-medium text-white transition-all duration-200 ${currentPage === 3
                ? 'bg-indigo-700 hover:bg-indigo-800'
                : 'bg-gradient-to-r from-indigo-500 to-indigo-900 hover:from-indigo-600 hover:to-indigo-950'
              }`}
          >
            {currentPage === 3 ? 'Submit' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

const PersonalInfoForm = () => {
  const { personalInfo, setPersonalInfo } = useFormStore();
  const [emailError, setEmailError] = useState('');
  const [zipError, setZipError] = useState('');

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateZip = (zip) => {
    const regex = /^\d{5}(-\d{4})?$/;
    return regex.test(zip);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo({ [name]: value });

    if (name === 'email') {
      setEmailError(validateEmail(value) ? '' : 'Please enter a valid email address.');
    }

    if (name === 'zipcode') {
      setZipError(validateZip(value) ? '' : 'Invalid ZIP code format.');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-white text-center">Personal Information</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-3 mb-1 px-5 py-2.5 rounded-full bg-white">
            <img src={assets.name_icon} alt="Name icon" className='w-5 h-5' />
            <input
              type="text"
              name="name"
              value={personalInfo.name}
              onChange={handleChange}
              className="outline-none bg-transparent text-indigo-800 placeholder-gray-500 w-full"
              placeholder="Enter your name"
            />
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-3 mb-1 px-5 py-2.5 rounded-full bg-white">
            <img src={assets.email_icon} alt="Email icon" className='w-5 h-5' />
            <input
              type="email"
              name="email"
              value={personalInfo.email}
              onChange={handleChange}
              className="outline-none bg-transparent text-indigo-800 placeholder-gray-500 w-full"
              placeholder="Enter your email"
            />
          </div>
          {emailError && <p className="text-red-400 text-xs px-3">{emailError}</p>}
        </div>
        <div className="flex items-center gap-3 mb-4 w-full px-5 py-2.5 rounded-full bg-white">
          <img src={assets.address_icon} alt="Address icon" className='w-5 h-5' />
          <input
            type="text"
            name="address1"
            value={personalInfo.address1}
            onChange={handleChange}
            className="outline-none bg-transparent text-indigo-800 placeholder-gray-500 w-full"
            placeholder="Enter address line 1"
          />
        </div>
        <div className="flex items-center gap-3 mb-4 w-full px-5 py-2.5 rounded-full bg-white">
          <img src={assets.address_icon} alt="Address icon" className='w-5 h-5' />
          <input
            type="text"
            name="address2"
            value={personalInfo.address2}
            onChange={handleChange}
            className="outline-none bg-transparent text-indigo-800 placeholder-gray-500 w-full"
            placeholder="Enter address line 2"
          />
        </div>
        <div className="flex items-center gap-3 mb-4 w-full px-5 py-2.5 rounded-full bg-white">
          <img src={assets.city_icon} alt="City icon" className='w-5 h-5' />
          <input
            type="text"
            name="city"
            value={personalInfo.city}
            onChange={handleChange}
            className="outline-none bg-transparent text-indigo-800 placeholder-gray-500 w-full"
            placeholder="Enter city"
          />
        </div>
        <div className="flex items-center gap-3 mb-4 w-full px-5 py-2.5 rounded-full bg-white">
          <img src={assets.state_icon} alt="State icon" className='w-5 h-5' />
          <select
            name="state"
            value={personalInfo.state}
            onChange={handleChange}
            className="outline-none bg-transparent text-gray-500 w-full"
          >
            <option value="">Select a state</option>
            <option value="CA">California</option>
            <option value="NY">New York</option>
            <option value="TX">Texas</option>
          </select>
        </div>
        <div className="flex flex-col col-span-1 sm:col-span-2">
          <div className="flex items-center gap-3 mb-1 px-5 py-2.5 rounded-full bg-white">
            <img src={assets.zip_icon} alt="Zipcode icon" className='w-5 h-5' />
            <input
              type="text"
              name="zipcode"
              value={personalInfo.zipcode}
              onChange={handleChange}
              className="outline-none bg-transparent text-indigo-800 placeholder-gray-500 w-full"
              placeholder="Enter zipcode"
            />
          </div>
          {zipError && <p className="text-red-400 text-xs px-3">{zipError}</p>}
        </div>
      </div>
    </div>
  );
};

const EducationForm = () => {
  const { education, setEducation } = useFormStore();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-white text-center">Educational Status</h2>
      <div>
        <label className="block text-indigo-300 mb-2">Are you still studying?</label>
        <div className="flex space-x-6">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="isStudying"
              checked={education.isStudying}
              onChange={() => setEducation({ isStudying: true })}
              className="h-5 w-5 text-indigo-500 focus:ring-indigo-500 border-gray-600 bg-white"
            />
            <span className="text-indigo-300">Yes</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="isStudying"
              checked={!education.isStudying}
              onChange={() => setEducation({ isStudying: false })}
              className="h-5 w-5 text-indigo-500 focus:ring-indigo-500 border-gray-600 bg-white"
            />
            <span className="text-indigo-300">No</span>
          </label>
        </div>
      </div>
      {education.isStudying && (
        <div className="flex items-center gap-3 mb-4 w-full px-5 py-2.5 rounded-full bg-white">
          <img src={assets.school_icon} alt="Institution icon" className='w-5 h-5' />
          <input
            type="text"
            name="institution"
            value={education.institution}
            onChange={(e) => setEducation({ institution: e.target.value })}
            className="outline-none bg-transparent text-indigo-800 placeholder-gray-500 w-full"
            placeholder="Enter institution name"
          />
        </div>
      )}
    </div>
  );
};

const ProjectsForm = () => {
  const { projects, setProjects } = useFormStore();
  const [newProject, setNewProject] = useState({ name: '', description: '' });

  const addProject = () => {
    if (newProject.name && newProject.description) {
      setProjects([...projects, newProject]);
      setNewProject({ name: '', description: '' });
    }
  };

  const removeProject = (index) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-white text-center">Projects</h2>
      <div className="space-y-4 bg-[#333A5C] p-6 rounded-xl">
        <div className="flex items-center gap-3 mb-4 w-full px-5 py-2.5 rounded-full bg-white">
          <img src={assets.project_icon} alt="Project icon" className='w-5 h-5' />
          <input
            type="text"
            value={newProject.name}
            onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
            className="outline-none bg-transparent text-indigo-800 placeholder-gray-500 w-full"
            placeholder="Enter project name"
          />
        </div>
        <div>
          <textarea
            value={newProject.description}
            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
            className="block w-full outline-none bg-white text-indigo-800 placeholder-gray-500 p-5 rounded-xl"
            rows="4"
            placeholder="Enter project description"
          />
        </div>
        <button
          onClick={addProject}
          className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium hover:from-indigo-600 hover:to-indigo-950 transition-all duration-200"
        >
          Add Project
        </button>
      </div>
      <div className="space-y-4 mt-6">
        {projects.map((project, index) => (
          <div key={index} className="border-l-4 border-indigo-500 p-6 rounded-r-xl bg-slate-900">
            <h3 className="text-lg font-semibold text-white">{project.name}</h3>
            <p className="text-indigo-300 mt-1">{project.description}</p>
            <button
              onClick={() => removeProject(index)}
              className="mt-3 text-indigo-500 hover:text-indigo-400 text-sm"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Form;