'use client';
import React, { useState } from 'react';
import { amazonOrderService } from '@/app/services/amazonOrderService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const InwardAmazonCSV = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      toast.error("Please upload a CSV file", { autoClose: 3000 });
      return;
    }

    try {
      const response = await amazonOrderService.uploadAmazonCSV(file);

      if (response.success) {
        toast.success("File uploaded successfully", { 
            autoClose: 3000,
            onClose: () => window.location.reload() 
          });
      } else {
        toast.error("Failed to upload file", { autoClose: 3000 });
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while uploading the file: " + error.message, { autoClose: 3000 });
    }
  };

  return (
    <div style={styles.container}>
      <ToastContainer />
      <h1 style={styles.header}>Inward Amazon Order CSV</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input 
          type="file" 
          accept=".csv" 
          onChange={handleFileChange} 
          style={styles.fileInput} 
        />
        <button type="submit" style={styles.button}>Upload CSV</button>
      </form>
    </div>
  );
}

export default InwardAmazonCSV;

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    maxWidth: '400px',
    margin: '50px auto',
  },
  header: {
    fontSize: '24px',
    color: '#333',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  fileInput: {
    marginBottom: '15px',
    padding: '8px',
    fontSize: '16px',
  },
  button: {
    backgroundColor: '#4CAF50',
    color: '#fff',
    padding: '10px 20px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
};

styles.button[':hover'] = {
  backgroundColor: '#45a049',
};
