import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

export const loginUser = async (credentials) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/login`, {
            email: credentials.email,
            password: credentials.psd
        });
        
        if (response.status === 200) {
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            return { success: true, data: response.data };
        }
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || "An error occurred during login"
        };
    }
};

export const registerUser = async (credentials) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/register`, {
            name: credentials.name,
            email: credentials.email,
            password: credentials.psd
        });
        
        if (response.status === 201) {
            return { success: true, data: response.data };
        }
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || "An error occurred during registration"
        };
    }
};


export const forgotPsd = async (credentials) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/forgotPsd`, {            
            email: credentials.email,
            psd: credentials.psd
        });
        
        if (response.status === 200) {
            return { success: true, data: response.data };
        }
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || "An error occurred during registration"
        };
    }
};

export const formsubmission = async(formData)=>{
    try{
        const response = await axios.post(
            "http://localhost:8000/api/submit",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
        return response;
    }catch(error){
        return {
            success: false,
            error: error.response?.data?.message || "An error occurred during form submission"
        };
    }
}