// Details
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

import { List, ListItem, ListItemText, Divider } from "@mui/material";

import { motion } from 'framer-motion';

const Details = (props) => {
    // URL for the API endpoint 
    const { url,  addCommentForm : AddCommentForm, csrfToken } = props;
    // ID from the URL 
    const { id } = useParams();

    const [selectedItem, setSelectedItem] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [comments, setComments] = useState([]);


    // Fetch piano and comment when component loads
    useEffect(() => {
        setIsLoading(true);

        const fetchData = async () => {
            try {
                const [pianoResponse, commentsResponse] = await Promise.all([
                    fetch(`${url}${id}/`),
                    fetch(`http://127.0.0.1:8000/api/comments?piano=${id}`)
                ])
                if (!pianoResponse.ok) throw new Error("Failed to fetch piano")

                const pianoData = await pianoResponse.json()
                const commentsData = await commentsResponse.json()

                setSelectedItem(pianoData);
                setComments(commentsData)
            }
            catch (err) {
                setError(err.message)
            } finally {
                setIsLoading(false)
            }
        };
        fetchData();
    }, [id, url]);

    // For Debugging only
    useEffect(() => {
        console.log("Comments:", comments)
    }, [comments])
    
    if (isLoading) return <div>Loading...</div>;

    if (error) return <div>Error: {error}</div>;

    if (!selectedItem) return <div>Item not found</div>;


    return (
        
        <div style={detailPageStyle}>
            <div style={detailStyle}>
                <h2>Details of {selectedItem.brand}</h2>
                <p>Price: ${selectedItem.price}</p>
                <p>Piano size in cm: {selectedItem.size}</p>
                <p>Owner: {selectedItem.owner_detail.username}</p>
                <motion.div>
                    <motion.img    
                        src={selectedItem.imageUrl} 
                        alt={selectedItem.brand} 
                        style={imageStyle}
                        whileHover={{ scale: 1.05 }}
                        onHoverStart={e => {}}
                        onHoverEnd={e => {}}
                    >
                    </motion.img>
                </motion.div>
            </div>

            {/* Comment Form */}
            < AddCommentForm 
                csrfToken={csrfToken} 
                id={parseInt(id)}
                onOptimisticComment={(newComment) => {
                    setComments(prev => [newComment, ...prev])
                }}
                />

            {/* Comment List */}
            <h4>Comments</h4>
            <List sx={{ width: "100%", maxWidth: 600 }}>
            {comments.map((comment) => (
                <React.Fragment key={comment.id}>
                <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                >
                    <ListItem 
                        sx={listItemStyle}
                        alignItems="flex-start"
                        >
                        <ListItemText
                        primary={comment.commenter_detail.username}
                        secondary={
                            <>
                            <span>{comment.text}</span>
                            <br />
                            <span style={{ color: "gray", fontSize: "0.6rem" }}>
                                {new Date(comment.created_at).toLocaleString()}
                            </span>
                            </>
                            } 
                        />
                    </ListItem>
                </motion.div>
                <Divider component="li" />
                </React.Fragment>
            ))}
            </List>

            {/* Edit button*/}
            {selectedItem.owner === selectedItem.current_user_id ?  
                <Link to={`/edit_piano/${id}`}>Edit this piano</Link> 
                : null}
        
            <Link to={`/index_inventory`}>Back to Piano Inventory</Link>

           
        </div>
    );
};

const detailPageStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '28px 0px',
}
const detailStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
    justifyContent: 'space-between',
    padding: '32px 32px',
    width: '50%',
    border: '1px solid black',
    backgroundColor: "#F0EAD6",
}
const imageStyle = {
    height: '304px',
    boxShadow: '12px 12px 8px #808080',
}
const listItemStyle = {
    backgroundColor: "#fafafa",
    borderRadius: 2,
    boxShadow: 1,
    mb: 1.2,
    px: 2,
    py: 1.5,
}

export default Details;

