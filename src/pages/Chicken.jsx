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
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  useEffect(() => {
    fetch("https://farm-records-backend.onrender.com/api/chicken-records/")
      .then(res => res.json())
      .then(data => {
        setRecords(data);
        if (data.length > 0) {
          const firstDate = new Date(data[0].date);
          setSelectedYear(firstDate.getFullYear().toString());
          setSelectedMonth(firstDate.toLocaleString("default", { month: "long" }));
        }
      });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://farm-records-backend.onrender.com/api/chicken-records/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (!response.ok) throw new Error("Failed to submit");

      const data = await response.json();
      setRecords([data, ...records]);
      setForm({ hens: "", eggs: "", date: "", feed: "", notes: "" });

      const dateObj = new Date(data.date);
      setSelectedYear(dateObj.getFullYear().toString());
      setSelectedMonth(dateObj.toLocaleString("default", { month: "long" }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getMonthName = (dateStr) => new Date(dateStr).toLocaleString("default", { month: "long" });
  const getYear = (dateStr) => new Date(dateStr).getFullYear().toString();

  // Group records by year and month
  const groupedByYearMonth = records.reduce((acc, rec) => {
    const year = getYear(rec.date);
    const month = getMonthName(rec.date);
    if (!acc[year]) acc[year] = {};
    if (!acc[year][month]) acc[year][month] = [];
    acc[year][month].push(rec);
    return acc;
  }, {});

  const years = Object.keys(groupedByYearMonth).sort((a, b) => b - a);

  return (
    <div>
      <h2 className="text-success mb-4">Chicken Records</h2>

      {/* Form */}
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
            <button type="submit" className="btn btn-success">Add Record</button>
          </div>
        </div>
      </form>

      {/* Year Buttons */}
      {years.length > 0 && (
        <div className="mb-3">
          <h5>Select Year:</h5>
          <div className="d-flex flex-wrap gap-2">
            {years.map((year) => (
              <button
                key={year}
                className={`btn ${selectedYear === year ? "btn-success" : "btn-outline-success"}`}
                onClick={() => {
                  setSelectedYear(year);
                  const months = Object.keys(groupedByYearMonth[year]);
                  if (months.length > 0) setSelectedMonth(months[0]);
                }}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Month Buttons */}
      {selectedYear && groupedByYearMonth[selectedYear] && (
        <div className="mb-3">
          <h5>Select Month:</h5>
          <div className="d-flex flex-wrap gap-2">
            {Object.keys(groupedByYearMonth[selectedYear]).map((month) => (
              <button
                key={month}
                className={`btn ${selectedMonth === month ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => setSelectedMonth(month)}
              >
                {month}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Table Display */}
      {selectedYear &&
        selectedMonth &&
        groupedByYearMonth[selectedYear]?.[selectedMonth] && (
          <div className="table-responsive mt-4">
            <h4 className="text-primary">{selectedMonth} {selectedYear} Records</h4>
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
                {groupedByYearMonth[selectedYear][selectedMonth].map((rec, index) => (
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
