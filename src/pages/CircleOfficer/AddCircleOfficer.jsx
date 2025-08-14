import React from 'react'

function AddCircleOfficer() {
  return (
    <div>
      <form action="">
        <div className="float-container">
          <input type="circle_name" id="circle_name" placeholder=" " className="float-input text-black " required />
          <label htmlFor="circle_name" className="float-label">Circle Name</label>
        </div>
        <div className='flex justify-end'>
          <button className='submit-btn  '>Submit</button>
        </div>
      </form>
    </div>
  )
}

export default AddCircleOfficer