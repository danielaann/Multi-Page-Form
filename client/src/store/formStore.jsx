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
  setPersonalInfo: (data) =>
    set((state) => ({ personalInfo: { ...state.personalInfo, ...data } })),
  setEducation: (data) =>
    set((state) => ({ education: { ...state.education, ...data } })),
  setProjects: (projects) => set({ projects }),
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