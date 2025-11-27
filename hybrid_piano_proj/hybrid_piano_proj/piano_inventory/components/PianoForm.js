// MUI style imports
import {Button,
    FormControl,
    Input,
    InputLabel,
    } from '@mui/material';

const PianoForm = () => {
    return (
        <div style={muiFormStyle}>
           
            {["brand", "price", "size", "url"].map((field) => {
                <FormControl>
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
                
            })}
                <Button style={muiSubmitBtn} type="submit" variant="contained">Edit Piano</Button>
        </div>
    )
}

export default PianoForm;

const muiFormStyle = {
    display: "flex",
    flexDirection: "column",
    height: "360px",
    width: "60%",
    justifyContent: "space-between",
}