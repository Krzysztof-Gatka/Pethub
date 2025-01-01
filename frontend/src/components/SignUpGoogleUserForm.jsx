import React, { ChangeEvent, useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const SignUpGoogleUserForm = ({userId}) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        secondName: "",
        phone: "",
      });
    
      // Handle input changes
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      };
    
      // Handle form submission
      const handleSubmit = async (e) => {
        e.preventDefault();
        formData.userId = userId;
        console.log(formData)
        try {
          const response = await axios.post("http://localhost:3000/auth/signup/form", formData);
        } catch (error) {
          console.error("error submitting form", error.response?.data || error.mesage)
        }
        console.log("Form Data:", formData);
        navigate("/")
        alert(`Form Submitted:\nName: ${formData.name}\nSecond Name: ${formData.secondName}\nPhone: ${formData.phone}`);
      };

  return (
    <Box 
      sx={{
        maxWidth: 400, 
        margin: "auto", 
        padding: 3, 
        boxShadow: 3, 
        borderRadius: 2
      }}
    >
      <Typography variant="h5" gutterBottom align="center">
        User Form
      </Typography>
      <form onSubmit={handleSubmit}>
        {/* Name Field */}
        <TextField
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        {/* Second Name Field */}
        <TextField
          label="Second Name"
          name="secondName"
          value={formData.secondName}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        {/* Phone Field */}
        <TextField
          label="Phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          type="tel"
        />
        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Submit
        </Button>
      </form>
    </Box>
  )
}

export default SignUpGoogleUserForm
