import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000"; // Use .env or default to localhost

function App() {
    const [disasters, setDisasters] = useState([]);
    const [formData, setFormData] = useState({ type: "", location: "", severity: "" });

    // ✅ Fetch disasters from backend on page load
    useEffect(() => {
        axios.get(`${API_URL}/disasters`)
            .then((res) => setDisasters(res.data))
            .catch((err) => console.error("Error fetching disasters:", err));
    }, []);

    // ✅ Handle form submission to send data to backend
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_URL}/disasters`, formData, {
                headers: { "Content-Type": "application/x-www-form-urlencoded" }
            });
            alert(response.data); // Show success message
            setDisasters([...disasters, formData]); // Update state with new disaster
            setFormData({ type: "", location: "", severity: "" }); // Reset form
        } catch (error) {
            console.error("Error reporting disaster:", error);
        }
    };

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h1>🌍 Disaster Management System</h1>

            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Disaster Type" value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })} required />
                <input type="text" placeholder="Location" value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })} required />
                <input type="number" placeholder="Severity (1-10)" value={formData.severity}
                    onChange={(e) => setFormData({ ...formData, severity: e.target.value })} required />
                <button type="submit">Report Disaster</button>
            </form>

            <h2>📌 Reported Disasters:</h2>
            <ul>
                {disasters.map((d, index) => (
                    <li key={index}>
                        <strong>{d.type}</strong> at {d.location} (Severity: {d.severity})
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
