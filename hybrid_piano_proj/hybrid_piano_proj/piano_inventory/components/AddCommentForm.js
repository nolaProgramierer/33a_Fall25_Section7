import React, { useState, useEffect } from 'react';
import { TextField, Button } from '@mui/material';

const AddCommentForm = ({ csrfToken, id, onOptimisticComment }) => {
  const [comment, setComment] = useState("");
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response =  await fetch("http://127.0.0.1:8000/api/comments/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken 
        },
        credentials: "include",
        body: JSON.stringify({
          text: comment,
          piano: id
        })
      });

      if (response.ok) {
        const newComment = await response.json();

        // Optimistic update: show comment immediately in parent
        if (onOptimisticComment) onOptimisticComment(newComment);

        setComment("");
        setSuccess("Comment added");
        setError(null);
      } else {
        throw new Error("Failed to add comment");
      }
    }
    catch (err){
      setSuccess(null);
      setError(err.message);
    }
  };

  // Log result of async POST
  useEffect(() => {
    if (success !== null) {
      console.log("SUCCESS:", success)
    }
    if (error !== null) {
      console.log("ERROR:", error)
    } 
  }, [success, error])


  return (
    <div>
      <form style={formStyle} onSubmit={handleSubmit}>
        <TextField
          multiline
          rows={3}
          id="comment-input"
          label="Add Comment"
          variant="outlined"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          fullWidth
        />
        <Button type="submit" variant="contained" style={btnStyle}>
          Add Comment
        </Button>

        {success && <p style={{ color: "green" }}>{success}</p>}
        {error && <p style={{color: "red"}}>{error}</p>}
      </form>
    </div>
  );
};

const formStyle = {
  margin: "20px",
};
const btnStyle = {
  marginTop: "10px",
};

export default AddCommentForm;
