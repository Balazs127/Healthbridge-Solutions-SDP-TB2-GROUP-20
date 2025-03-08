import axios from "axios";

const API_BASE_URL = "https://balazskis.com/healthbridge/api";

const get = (endpoint, params = {}) => {
  return axios.get(`${API_BASE_URL}/${endpoint}`, { params });
};

const post = (endpoint, data = {}) => {
  return axios.post(`${API_BASE_URL}/${endpoint}`, data);
};

const put = (endpoint, data = {}) => {
  return axios.put(`${API_BASE_URL}/${endpoint}`, data);
};

const del = (endpoint) => {
  return axios.delete(`${API_BASE_URL}/${endpoint}`);
};

const patch = (endpoint, data = {}) => {
  return axios.patch(`${API_BASE_URL}/${endpoint}`, data);
};

const fetchCalculations = (
  field,
  value,
  setData,
  setLoading,
  setError,
  errorMessage = "Failed to load data"
) => {
  return get("egfr_calculations", { field, value })
    .then((response) => {
      setData(response.data);
      setLoading(false);
      return response; // Return response for chaining
    })
    .catch((err) => {
      console.error("Error fetching data:", err);
      setError(errorMessage);
      setLoading(false);
      throw err; // Re-throw for further handling if needed
    });
};

const fetchUserData = (user, setUserData, setLoading = null, setError = null) => {
  if (!user || !user.isAuthenticated) return Promise.resolve(null);
  
  if (setLoading) setLoading(true);
  
  const endpoint = user.userType === "patient" 
    ? `patientlogin/${user.userId}` 
    : `clinicianlogin/${user.userId}`;

  return get(endpoint)
    .then((response) => {
      if (setUserData) {
        setUserData(response.data);
      }
      if (setLoading) setLoading(false);
      return response.data;
    })
    .catch((err) => {
      console.error(`Error fetching ${user.userType} data:`, err);
      if (setError) {
        setError(`Failed to load ${user.userType} data`);
      }
      if (setLoading) setLoading(false);
      throw err;
    });
};

export { API_BASE_URL, get, post, put, del as delete, patch, fetchCalculations, fetchUserData };
