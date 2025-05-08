import React, { useState, useEffect } from "react";

const Cows = () => {
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({
    cows: "",
    milk: "",
    date: "",
    feed: "",
    notes: "",
  });
  const [selectedMonth, setSelectedMonth] = useState("");

  useEffect(() => {
    fetch("https://farm-records-backend.onrender.com/api/cow-records/")
      .then((res) => res.json())
      .then((data) => {
        setRecords(data);
        const firstMonth = data.length > 0 ? getMonthName(data[0].date) : "";
        setSelectedMonth(firstMonth);
      });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "https://farm-records-backend.onrender.com/api/cow-records/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      if (!response.ok) throw new Error("Failed to submit");

      const data = await response.json();
      setRecords([data, ...records]);
      setForm({ cows: "", milk: "", date: "", feed: "", notes: "" });

      const month = getMonthName(data.date);
      setSelectedMonth(month);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getMonthName = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString("default", { month: "long" });
  };

  // Group records by month
  const groupedByMonth = records.reduce((acc, rec) => {
    const month = getMonthName(rec.date);
    if (!acc[month]) acc[month] = [];
    acc[month].push(rec);
    return acc;
  }, {});

  const monthNames = Object.keys(groupedByMonth);

  return (
    <div>
      <h2 className="text-success mb-4">Cows Records</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row gap-3">
          <div className="col-md-3">
            <label htmlFor="cows" className="form-label">
              Number of cows
            </label>
            <input
              type="number"
              name="cows"
              className="form-control"
              required
              value={form.cows}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-3">
            <label htmlFor="milk" className="form-label">
              Milk (Litres)
            </label>
            <input
              type="number"
              name="milk"
              className="form-control"
              required
              value={form.milk}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-3">
            <label htmlFor="date" className="form-label">
              Date
            </label>
            <input
              type="date"
              name="date"
              className="form-control"
              required
              value={form.date}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-3">
            <label htmlFor="feed" className="form-label">
              Feeds Consumed (kg)
            </label>
            <input
              type="number"
              name="feed"
              className="form-control"
              required
              value={form.feed}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-12">
            <label htmlFor="notes" className="form-label">
              Notes
            </label>
            <textarea
              name="notes"
              className="form-control"
              required
              value={form.notes}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-12 text-end">
            <button type="submit" className="btn btn-success">
              Add Record
            </button>
          </div>
        </div>
      </form>

      {/* Month Selector */}
      {monthNames.length > 0 && (
        <div className="mb-3">
          <h5>Select Month:</h5>
          <div className="d-flex flex-wrap gap-2">
            {monthNames.map((month) => (
              <button
                key={month}
                className={`btn ${
                  selectedMonth === month ? "btn-success" : "btn-outline-success"
                }`}
                onClick={() => setSelectedMonth(month)}
              >
                {month}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Display Table for Selected Month */}
      {selectedMonth && groupedByMonth[selectedMonth] && (
        <div className="table-responsive mt-4">
          <h4 className="text-primary">{selectedMonth} Records</h4>
          <table className="table table-striped table-bordered">
            <thead className="table-success">
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Cows</th>
                <th>Milk</th>
                <th>Feeds (kg)</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {groupedByMonth[selectedMonth].map((rec, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{rec.date}</td>
                  <td>{rec.cows}</td>
                  <td>{rec.milk}</td>
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
};

export default Cows;
