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

/**
 * Handles API responses consistently, with options for normalizing data
 * @param {Promise} promise - The axios promise
 * @param {Function} setData - Optional state setter for data
 * @param {Function} setLoading - Optional state setter for loading status
 * @param {Function} setError - Optional state setter for error state
 * @param {string} errorMessage - Error message to use if request fails
 * @param {string} logLabel - Label for console logging
 * @param {boolean} asArray - Whether to normalize response data as an array
 */
const handleApiResponse = (
  promise,
  setData = null,
  setLoading = null,
  setError = null,
  errorMessage = "API request failed",
  logLabel = "API data",
  asArray = false
) => {
  if (setLoading) setLoading(true);

  return promise
    .then((response) => {
      console.log(`${logLabel} response:`, response.data);

      if (setData) {
        // Normalize data to array if requested
        if (asArray) {
          const normalizedData = Array.isArray(response.data)
            ? response.data
            : response.data
            ? [response.data]
            : [];
          setData(normalizedData);
        } else {
          setData(response.data);
        }
      }

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
  filters = {},
  setData,
  setLoading,
  setError,
  errorMessage = "Failed to load data"
) => {
  console.log(`Fetching calculations with filters:`, filters);

  if (Object.keys(filters).length === 0) {
    console.error("Missing filters for fetch calculations");
    setError("Missing query parameters");
    setLoading(false);
    return Promise.reject("Missing filters");
  }

  return handleApiResponse(
    get("egfr_calculations", filters),
    setData,
    setLoading,
    setError,
    errorMessage,
    "Calculations",
    true // Always normalize as array
  );
};

const fetchUserData = (user, setUserData, setLoading = null, setError = null) => {
  if (!user || !user.isAuthenticated) return Promise.resolve(null);

  const endpoint =
    user.userType === "patient" ? `patientlogin/${user.userId}` : `clinicianlogin/${user.userId}`;

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
    get("patientlogin", { ClinicianID: clinicianId }),
    setData,
    setLoading,
    setError,
    errorMessage,
    "Patients list",
    true // Always normalize as array
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
  handleApiResponse,
};
