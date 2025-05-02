import React, {useState, useEffect} from 'react'

const Horticulture = () => {
  const [records, setRecords] = useState([])
  const [form, setForm] = useState({
    crop_name: "",
    crop_type: "",
    planting_date: "",
    harvest_date: "",
    quantity: "",
    unit: "",
    notes: ""
  })
  useEffect(() => {
    fetch("http://localhost:8000/api/horticulture-records/")
      .then(res => res.json())
      .then(data => setRecords(data))
  }, [])
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch("http://localhost:8000/api/horticulture-records/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      })
      if (!response.ok) throw new Error("Failed to submit")
      const data = await response.json()
      setRecords([data, ...records])
      setForm({
        crop_name: "",
        crop_type: "",
        planting_date: "",
        harvest_date: "",
        quantity: "",
        unit: "",
        notes: ""
      })
    } catch (error) {
      console.error("Error:", error)
    }
  }
  const cropTypes = ["Fruit", "Vegetable", "Herb", "Flower", "Other"];
  return (
    <div>
      <h1 className='text-success mb-4'>Horticulture Records</h1>
      <form onSubmit={handleSubmit} className='mb-4'>
        <div className="row gap-3">
          <div className="col-md-3">
            <label htmlFor="crop_name" className="form-label">Crop Name</label>
            <input
              type='text'
              name='crop_name'
              className='form-control'
              required
              value={form.crop_name}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-3">
            <select name="crop_type" value={form.crop_type} onChange={handleChange}>
              <option value="">Select Crop Type</option>
              {cropTypes.map((type, index) => (
                <option key={index} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <label htmlFor="planting_date" className='form-label'>Planting Date</label>
            <input
              type='date'
              name='planting_date'
              className='form-control'
              required
              value={form.planting_date}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-3">
            <label htmlFor="harvest_date" className='form-label'>Harvest Date</label>
            <input
              type='date'
              name='harvest_date'
              className='form-control'
              required
              value={form.harvest_date}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-3">
            <label htmlFor="quantity" className='form-label'>Quantity (kg)</label>
            <input
              type='number'
              name='quantity'
              className='form-control'
              required
              value={form.quantity}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-3">
            <label htmlFor="unit" className='form-label'>Unit</label>
            <select name="unit" value={form.unit} onChange={handleChange}>
              <option value="">Select Unit</option>
              <option value="kg">kg</option>
              <option value="lbs">lbs</option>
              <option value="pieces">pieces</option>
            </select>
          </div>
          <div className="col-md-3">
            <label htmlFor="notes" className='form-label'>Notes</label>
            <textarea
              name='notes'
              className='form-control'
              required
              value={form.notes}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-12 text-end">
            <button type='submit' className='btn btn-success'>Add Record</button>
          </div>
        </div>
      </form>
      {/* Add a table or list to display the records here */}
      {records.length > 0 && (
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th>Crop Name</th>
                <th>Crop Type</th>
                <th>Planting Date</th>
                <th>Harvest Date</th>
                <th>Quantity</th>
                <th>Unit</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record, index) => (
                <tr key={index}>
                  <td>{record.crop_name}</td>
                  <td>{record.crop_type}</td>
                  <td>{record.planting_date}</td>
                  <td>{record.harvest_date}</td>
                  <td>{record.quantity}</td>
                  <td>{record.unit}</td>
                  <td>{record.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Horticulture
