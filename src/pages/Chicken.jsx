import React, { useState, useEffect } from "react";

function Chicken() {
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({
    hens: "",
    eggs: "",
    date: "",
    feed: "",
    notes: ""
  });
  useEffect(() => {
    fetch("http://localhost:8000/api/chicken-records/")
      .then(res => res.json())
      .then(data => setRecords(data));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch("https://farm-records-backend.onrender.com/api/chicken-records/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(form)
        });
    
        if (!response.ok) throw new Error("Failed to submit");
    
        const data = await response.json();
        setRecords([data, ...records]);
        setForm({ hens: "", eggs: "", date: "", feed: "", notes: "" });
      } catch (error) {
        console.error("Error:", error);
    }

  };

  return (
    <div>
      <h2 className="text-success mb-4">Chicken Records</h2>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row g-3">
          <div className="col-md-3">
            <label className="form-label">Number of Hens</label>
            <input
              type="number"
              name="hens"
              value={form.hens}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Number of Eggs</label>
            <input
              type="number"
              name="eggs"
              value={form.eggs}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Feeds Consumed (kg)</label>
            <input
              type="number"
              name="feed"
              value={form.feed}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="col-md-12">
            <label className="form-label">Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              className="form-control"
              rows="2"
              placeholder="Optional notes..."
            />
          </div>
          <div className="col-md-12 text-end">
            <button type="submit" className="btn btn-success">
              Add Record
            </button>
          </div>
        </div>
      </form>

      {/* Display Table */}
      {records.length > 0 && (
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead className="table-success">
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Hens</th>
                <th>Eggs</th>
                <th>Feeds (kg)</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {records.map((rec, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{rec.date}</td>
                  <td>{rec.hens}</td>
                  <td>{rec.eggs}</td>
                  <td>{rec.feed}</td>
                  <td>{rec.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Chicken;
