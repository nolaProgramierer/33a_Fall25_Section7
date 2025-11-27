import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Imported components
import ListView from './ListView';
import Details from './Details';
import AddPianoForm from './AddPianoForm';
import EditPiano from './EditPiano';
import AddCommentForm from './AddCommentForm';

// Main component
const App = () => {

const [data, setData] = useState([]);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState(null);

// Url of Django api
const url = `http://127.0.0.1:8000/api/pianos/`

const fetchPianos = async () => {
    setIsLoading(true);
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Failed to fetch data")
        }
        const data = await response.json();
        setData(data)
    }
    catch (err) {
        setError(err.message)
    } finally {
        setIsLoading(false)
    }
};

    // Fetch piano list on mount
    useEffect(() => {
        fetchPianos();
        }, []);

    // Ensure csrf token is set in Django
    useEffect(() => {
        fetch("http://127.0.0.1:8000/init_csrf/", { credentials: "include" })
            .then(res => res.json())
            .then(data => console.log("CSRF initialized:", data))
            .catch(err => console.error("CSRF init error:", err));
        }, []);

    // Get CSRF token from cookie; avoids csrf_exempt in Django views
    const csrfToken = useMemo(() => {
        return document.cookie
            .split('; ')
            .find(row => row.startsWith('csrftoken='))
            ?.split('=')[1];
        }, []) 

    // Ensure that App component has updated state upon child component sate change
    const updatePianoList = fetchPianos;
 
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;


   return (
    <Router>
        <Routes>
            {/* Display list of all pianos */}
            <Route path ="/index_inventory" element={<ListView data={data}/>} />
            
            {/* Pass data to Details component if data is available */}
            {data && <Route path="/piano_details/:id" element={
                                                        <Details data={data} 
                                                        url={url} 
                                                        csrfToken={csrfToken}
                                                        addCommentForm={AddCommentForm}
                                                        />
                                                        } 
            />}

            {/* Add a piano */}
            <Route path ="/piano_list" element={
                                        <AddPianoForm apiUrl={url} 
                                        onPianoAdded={updatePianoList} 
                                        csrfToken={csrfToken} 
                                        />
                                        } 
            />

            {/* Edit a piano */}
            <Route path="/edit_piano/:id" element={
                                            <EditPiano apiUrl={url} 
                                            onPianoDeleted={updatePianoList}
                                            csrfToken={csrfToken}
                                            />
                                            } 
            />
       </Routes>
    </Router> 
   )
}

export default App;