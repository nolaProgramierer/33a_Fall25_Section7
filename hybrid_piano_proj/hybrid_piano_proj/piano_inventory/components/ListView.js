import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll } from "framer-motion"

const ListView = (props) => {
    const { data } = props;

    return (
       <motion.div 
        style={containerStyle}
        >
            <h3>Piano List View</h3>
            <div>
                <ul style={listStyle}>
                    
                    {data && data.map((item) => (
                    <li style={listItemStyle} key={item.id}>
                        <Link to={`/piano_details/${item.id}`}>{item.brand}</Link>
                       
                        <motion.img
                        src={item.imageUrl}
                        alt="piano"
                        style={imgStyle}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        whileHover={{ scale: 1.1 }}
                        />                        
                        
                    </li>
                    ))}
                </ul>
            </div>
            <div style={linkStyle}>
                {/* Handled by Django routes */}
                <a  style={linkItemStyle} href="/add_piano">Add a piano(sync)</a>
                {/* Handled by React routing */}
                <Link  style={linkItemStyle} to={'/piano_list'}>Add a piano(async)</Link>
            </div>
            
       </motion.div>   
    )
}

const containerStyle = {
    display: "flex",
    flexDirection: "column",
    flexWrap: "nowrap",
    justifyContent: "center",
    alignItems: "center",
}
const listStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
}
const linkStyle = {
    display: "flex",
    justifyContent: "space-between",
    width: "50%",
    padding: "20px",
    color: "#696969",
}
const linkItemStyle = {
    color: "#a9a9a9",
}
const listItemStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px",
    width: "100%",
    border: "1px solid black",
    marginBottom: "12px",
    backgroundColor: "#F0EAD6",
}
const imgStyle = {
    boxShadow: "12px 12px 8px #808080",
    width: "150px",
}

export default ListView;