import React from 'react'

function AddZonalHead() {
  return (
    <div>
      <form action="">
        <div className="float-container">
          <input type="Zone_name" id="Zone_name" placeholder=" " className="float-input text-black " required />
          <label htmlFor="Zone_name" className="float-label">Zone Name</label>
        </div>
        <div className='flex justify-end'>
          <button className='submit-btn  '>Submit</button>
        </div>
      </form>
    </div>
  )
}

export default AddZonalHead