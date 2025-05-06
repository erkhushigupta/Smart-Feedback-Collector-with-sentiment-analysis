import React, { useState, useEffect } from "react";
import axios from "axios";

function FeedbackCollector() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/feedback").then((res) => {
      setFeedbacks(res.data);
    });
  }, []);

  const handleSubmit = async () => {
    const res = await axios.post("http://localhost:5000/submit", {
      user: "New User",
      feedback: input,
      timestamp: new Date().toISOString()
    });
    setFeedbacks([...feedbacks, res.data.data]);
    setInput("");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Philips Smart Bulb Feedback</h2>
      <textarea value={input} onChange={(e) => setInput(e.target.value)} rows="4" cols="50" />
      <br />
      <button onClick={handleSubmit}>Submit Feedback</button>
      <h3>All Feedbacks</h3>
      <ul>
        {feedbacks.map((fb, index) => (
          <li key={index}>
            <strong>{fb.user}:</strong> {fb.feedback} <em>({fb.sentiment})</em>
          </li>
        ))}
      </ul>
      <h4><a href="https://forms.gle/dummyfeedbackform" target="_blank">Google Form (External Feedback)</a></h4>
    </div>
  );
}

export default FeedbackCollector;
