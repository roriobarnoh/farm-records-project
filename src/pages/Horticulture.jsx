import React, { useState, useEffect } from 'react';

const Horticulture = () => {
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({
    crop_name: "",
    crop_type: "",
    planting_date: "",
    harvest_date: "",
    quantity: "",
    unit: "",
    price_per_unit: "",
    expense: "",
    notes: ""
  });

  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  useEffect(() => {
    fetch("https://farm-records-backend.onrender.com/api/horticulture-records/")
      .then(res => res.json())
      .then(data => {
        setRecords(data);
        if (data.length > 0) {
          const first = new Date(data[0].planting_date);
          setSelectedYear(first.getFullYear().toString());
          setSelectedMonth(first.toLocaleString('default', { month: 'long' }));
        }
      });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://farm-records-backend.onrender.com/api/horticulture-records/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      if (!response.ok) throw new Error("Failed to submit");

      const data = await response.json();
      setRecords([data, ...records]);
      setForm({
        crop_name: "",
        crop_type: "",
        planting_date: "",
        harvest_date: "",
        quantity: "",
        unit: "",
        price_per_unit: "",
        expense: "",
        notes: ""
      });

      const date = new Date(data.planting_date);
      setSelectedYear(date.getFullYear().toString());
      setSelectedMonth(date.toLocaleString('default', { month: 'long' }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const cropTypes = ["Fruit", "Vegetable", "Herb", "Flower", "Other"];

  const getMonthName = (dateStr) => new Date(dateStr).toLocaleString('default', { month: 'long' });
  const getYear = (dateStr) => new Date(dateStr).getFullYear().toString();

  const grouped = records.reduce((acc, rec) => {
    const year = getYear(rec.planting_date);
    const month = getMonthName(rec.planting_date);
    if (!acc[year]) acc[year] = {};
    if (!acc[year][month]) acc[year][month] = [];
    acc[year][month].push(rec);
    return acc;
  }, {});

  const years = Object.keys(grouped).sort((a, b) => b - a);

  const calculateTotals = (data) => {
    let income = 0, expense = 0;
    data.forEach(r => {
      const price = parseFloat(r.price_per_unit || 0);
      const qty = parseFloat(r.quantity || 0);
      const cost = parseFloat(r.expense || 0);
      income += price * qty;
      expense += cost;
    });
    return { income, expense, net: income - expense };
  };

  return (
    <div>
      <h1 className='text-success mb-4'>Horticulture Records</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className='mb-4'>
        <div className="row g-3">
          <div className="col-md-3">
            <label className="form-label">Crop Name</label>
            <input type='text' name='crop_name' className='form-control' required value={form.crop_name} onChange={handleChange} />
          </div>
          <div className="col-md-3">
            <label className="form-label">Crop Type</label>
            <select name="crop_type" value={form.crop_type} onChange={handleChange} className="form-control">
              <option value="">Select Crop Type</option>
              {cropTypes.map((type, index) => (
                <option key={index} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <label className='form-label'>Planting Date</label>
            <input type='date' name='planting_date' className='form-control' required value={form.planting_date} onChange={handleChange} />
          </div>
          <div className="col-md-3">
            <label className='form-label'>Harvest Date</label>
            <input type='date' name='harvest_date' className='form-control' required value={form.harvest_date} onChange={handleChange} />
          </div>
          <div className="col-md-2">
            <label className='form-label'>Quantity</label>
            <input type='number' name='quantity' className='form-control' required value={form.quantity} onChange={handleChange} />
          </div>
          <div className="col-md-2">
            <label className='form-label'>Unit</label>
            <select name="unit" value={form.unit} onChange={handleChange} className="form-control">
              <option value="">Select Unit</option>
              <option value="kg">kg</option>
              <option value="lbs">lbs</option>
              <option value="pieces">pieces</option>
            </select>
          </div>
          <div className="col-md-2">
            <label className='form-label'>Price/Unit</label>
            <input type='number' name='price_per_unit' className='form-control' value={form.price_per_unit} onChange={handleChange} />
          </div>
          <div className="col-md-2">
            <label className='form-label'>Expense</label>
            <input type='number' name='expense' className='form-control' value={form.expense} onChange={handleChange} />
          </div>
          <div className="col-md-4">
            <label className='form-label'>Notes</label>
            <textarea name='notes' className='form-control' required value={form.notes} onChange={handleChange} />
          </div>
          <div className="col-md-12 text-end">
            <button type='submit' className='btn btn-success'>Add Record</button>
          </div>
        </div>
      </form>

      {/* Year Buttons */}
      {years.length > 0 && (
        <div className="mb-3">
          <h5>Select Year:</h5>
          <div className="d-flex flex-wrap gap-2">
            {years.map((year) => (
              <button key={year} className={`btn ${selectedYear === year ? "btn-success" : "btn-outline-success"}`} onClick={() => {
                setSelectedYear(year);
                const months = Object.keys(grouped[year]);
                if (months.length > 0) setSelectedMonth(months[0]);
              }}>
                {year}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Month Buttons */}
      {selectedYear && grouped[selectedYear] && (
        <div className="mb-3">
          <h5>Select Month:</h5>
          <div className="d-flex flex-wrap gap-2">
            {Object.keys(grouped[selectedYear]).map((month) => (
              <button key={month} className={`btn ${selectedMonth === month ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setSelectedMonth(month)}>
                {month}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Records Table */}
      {selectedYear && selectedMonth && grouped[selectedYear]?.[selectedMonth] && (
        <div className="table-responsive mt-4">
          <h4 className="text-primary">{selectedMonth} {selectedYear} Records</h4>
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th>Crop</th>
                <th>Type</th>
                <th>Planting</th>
                <th>Harvest</th>
                <th>Qty</th>
                <th>Unit</th>
                <th>Price/Unit</th>
                <th>Income</th>
                <th>Expense</th>
                <th>Net</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {grouped[selectedYear][selectedMonth].map((record, index) => {
                const qty = parseFloat(record.quantity || 0);
                const price = parseFloat(record.price_per_unit || 0);
                const exp = parseFloat(record.expense || 0);
                const income = qty * price;
                const net = income - exp;
                return (
                  <tr key={index}>
                    <td>{record.crop_name}</td>
                    <td>{record.crop_type}</td>
                    <td>{record.planting_date}</td>
                    <td>{record.harvest_date}</td>
                    <td>{qty}</td>
                    <td>{record.unit}</td>
                    <td>{price.toFixed(2)}</td>
                    <td>{income.toFixed(2)}</td>
                    <td>{exp.toFixed(2)}</td>
                    <td>{net.toFixed(2)}</td>
                    <td>{record.notes}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Totals Summary */}
          <div className="mt-3">
            {(() => {
              const totals = calculateTotals(grouped[selectedYear][selectedMonth]);
              return (
                <div className="alert alert-info">
                  <strong>Total Income:</strong> ${totals.income.toFixed(2)} | 
                  <strong> Expenses:</strong> ${totals.expense.toFixed(2)} | 
                  <strong> Net:</strong> ${totals.net.toFixed(2)}
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default Horticulture;
