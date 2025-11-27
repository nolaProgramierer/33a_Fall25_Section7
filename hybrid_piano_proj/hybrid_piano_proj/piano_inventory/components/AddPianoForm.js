import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {Button,
        FormControl,
        Input,
        InputLabel,
        } from '@mui/material';

const AddPianoForm = ({ apiUrl, onPianoAdded, csrfToken})=> {
    const navigate = useNavigate();
    const [piano, setPiano] = useState({
        brand: '',
        price: '',
        size: '',
        imageUrl: '',
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setPiano((prevPiano) => ({...prevPiano, [name]: value}));
        setError(null);
        setSuccess(null);
        console.log(piano);
    };
    
    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrfToken
                },
                credentials: "include",
                body: JSON.stringify(piano),
            });

            if (response.ok) {
                // Clear form
                setPiano({ brand: "", size: "", price: "", imageUrl: ""});
                setSuccess("Piano added successfully");
                setError(null);
                
                if (onPianoAdded) {
                    // Refresh the parent component
                    await onPianoAdded();
                } 
                console.log("Navigating to /index_inventory...");
                navigate("/index_inventory");

            } else {
                throw new Error("Failed to add piano");
            }  
        } catch (err) {
            setError(err.message);
            setSuccess(false);
        }
    };

    const inputFields = ["brand", "price", "size", "imageUrl"]

    return (
        <div style={formContainer}>
            <h3>Add a new piano</h3>
            {error && <p>{error}</p>}
            {success && <p>Piano added successfuly!</p>}

            <form style={muiFormStyle} onSubmit={handleSubmit}>
                {inputFields.map((field) => (
                    <FormControl key={field}>
                        <InputLabel htmlFor={`form-${field}`}>
                            {field.charAt(0).toUpperCase() + field.slice(1)}
                        </InputLabel>
                        <Input
                            type={field === "price" || field === "size" ? "number" : "text"}
                            name={field}
                            value={piano[field] || ""}
                            onChange={handleChange}
                            id={`form-${field}`}
                        />
                    </FormControl>
                ))}
                <Button style={muiBtn} type="submit" variant="contained">Add New Piano</Button>
            </form>
            <Link to={`/index_inventory`}>Back to Piano Inventory</Link>
        </div>   
    )
}

const formContainer = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
}
const muiFormStyle = {
    display: "flex",
    flexDirection: "column",
    height: "360px",
    width: "60%",
    justifyContent: "space-between",
}
const muiBtn = {
    margin: "20px 0px",
}
export default AddPianoForm;