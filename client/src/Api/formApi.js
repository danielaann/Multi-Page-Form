import axios from 'axios';

axios.defaults.withCredentials = true;

export const getFormData = async () => {
  const res = await axios.get('http://localhost:4000/api/form/get');
  return res.data;
};

export const saveFormData = async (data) => {
  await axios.post('http://localhost:4000/api/form/save', data);
};
