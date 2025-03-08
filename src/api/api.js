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

const handleApiResponse = (
  promise,
  setData = null,
  setLoading = null,
  setError = null,
  errorMessage = "API request failed",
  logLabel = "API data"
) => {
  if (setLoading) setLoading(true);
  
  return promise
    .then((response) => {
      console.log(`${logLabel} response:`, response.data);
      if (setData) setData(response.data);
      if (setLoading) setLoading(false);
      return response;
    })
    .catch((err) => {
      console.error(`Error: ${logLabel}:`, err);
      if (setError) setError(errorMessage);
      if (setLoading) setLoading(false);
      throw err;
    });
};

const fetchCalculations = (
  field,
  value,
  setData,
  setLoading,
  setError,
  errorMessage = "Failed to load data"
) => {
  console.log(`Fetching calculations with ${field}=${value}`);
  
  if (!value) {
    console.error("Missing value for fetch calculations");
    setError("Missing patient ID");
    setLoading(false);
    return Promise.reject("Missing value");
  }
  
  return handleApiResponse(
    get("egfr_calculations", { field, value }),
    setData,
    setLoading,
    setError,
    errorMessage,
    "Calculations"
  );
};

const fetchUserData = (user, setUserData, setLoading = null, setError = null) => {
  if (!user || !user.isAuthenticated) return Promise.resolve(null);
  
  const endpoint = user.userType === "patient" 
    ? `patientlogin/${user.userId}` 
    : `clinicianlogin/${user.userId}`;

  return handleApiResponse(
    get(endpoint),
    setUserData,
    setLoading,
    setError,
    `Failed to load ${user.userType} data`,
    `${user.userType} data`
  );
};

const fetchPatientsByClinicianId = (
  clinicianId,
  setData,
  setLoading,
  setError,
  errorMessage = "Failed to load patients"
) => {
  return handleApiResponse(
    get("patientlogin", { field: "ClinicianID", value: clinicianId }),
    setData,
    setLoading,
    setError,
    errorMessage,
    "Patients list"
  );
};

const fetchPatientById = (
  patientId,
  setData,
  setLoading,
  setError,
  errorMessage = "Failed to load patient details"
) => {
  return handleApiResponse(
    get(`patientlogin/${patientId}`),
    setData,
    setLoading,
    setError,
    errorMessage,
    "Patient details"
  );
};

export { 
  API_BASE_URL, 
  get, 
  post, 
  put, 
  del as delete, 
  patch, 
  fetchCalculations, 
  fetchUserData,
  fetchPatientsByClinicianId,
  fetchPatientById,
  handleApiResponse 
};
