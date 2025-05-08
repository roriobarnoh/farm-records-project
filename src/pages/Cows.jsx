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
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  useEffect(() => {
    fetch("https://farm-records-backend.onrender.com/api/cow-records/")
      .then((res) => res.json())
      .then((data) => {
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
      const response = await fetch(
        "https://farm-records-backend.onrender.com/api/cow-records/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      if (!response.ok) throw new Error("Failed to submit");

      const data = await response.json();
      setRecords([data, ...records]);
      setForm({ cows: "", milk: "", date: "", feed: "", notes: "" });

      const dateObj = new Date(data.date);
      setSelectedYear(dateObj.getFullYear().toString());
      setSelectedMonth(dateObj.toLocaleString("default", { month: "long" }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getMonthName = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString("default", { month: "long" });
  };

  const getYear = (dateStr) => {
    return new Date(dateStr).getFullYear().toString();
  };

  // Group records by year and then by month
  const groupedByYearMonth = records.reduce((acc, rec) => {
    const year = getYear(rec.date);
    const month = getMonthName(rec.date);
    if (!acc[year]) acc[year] = {};
    if (!acc[year][month]) acc[year][month] = [];
    acc[year][month].push(rec);
    return acc;
  }, {});

  const years = Object.keys(groupedByYearMonth).sort((a, b) => b - a); // descending order

  return (
    <div>
      <h2 className="text-success mb-4">Cows Records</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row gap-3">
          <div className="col-md-3">
            <label className="form-label">Number of cows</label>
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
            <label className="form-label">Milk (Litres)</label>
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
            <label className="form-label">Date</label>
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
            <label className="form-label">Feeds Consumed (kg)</label>
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
            <label className="form-label">Notes</label>
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

      {/* Year Buttons */}
      {years.length > 0 && (
        <div className="mb-3">
          <h5>Select Year:</h5>
          <div className="d-flex flex-wrap gap-2">
            {years.map((year) => (
              <button
                key={year}
                className={`btn ${
                  selectedYear === year ? "btn-success" : "btn-outline-success"
                }`}
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
                className={`btn ${
                  selectedMonth === month ? "btn-primary" : "btn-outline-primary"
                }`}
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
        groupedByYearMonth[selectedYear] &&
        groupedByYearMonth[selectedYear][selectedMonth] && (
          <div className="table-responsive mt-4">
            <h4 className="text-primary">
              {selectedMonth} {selectedYear} Records
            </h4>
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
                {groupedByYearMonth[selectedYear][selectedMonth].map((rec, index) => (
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
