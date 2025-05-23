import { create } from 'zustand';

export const useFormStore = create((set) => ({
  personalInfo: {
    name: '',
    email: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipcode: ''
  },
  education: {
    isStudying: false,
    institution: ''
  },
  projects: [],

  // Setters
  setPersonalInfo: (data) =>
    set((state) => ({ personalInfo: { ...state.personalInfo, ...data } })),
  setEducation: (data) =>
    set((state) => ({ education: { ...state.education, ...data } })),
  setProjects: (projects) => set({ projects }),

  // Optional: Add project management
  addProject: (project) =>
    set((state) => ({ projects: [...state.projects, project] })),
  removeProject: (index) =>
    set((state) => ({
      projects: state.projects.filter((_, i) => i !== index)
    })),

  // Reset
  reset: () =>
    set(() => ({
      personalInfo: {
        name: '',
        email: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        zipcode: ''
      },
      education: { isStudying: false, institution: '' },
      projects: []
    }))
}));
