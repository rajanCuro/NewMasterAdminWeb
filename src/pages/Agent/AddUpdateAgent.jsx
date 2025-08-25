import React from 'react'

function AddUpdateAgent({editData}) {
  console.log('editeData',editData);
  return (
    <div>
      <form action="">
        <div className="float-container">
          <input type="text" id="name" placeholder=" " className="float-input" required />
          <label htmlFor="name" className="float-label">Agent Name</label>
        </div>
        <div className='float-container'>
          <input type="text" id="phone" placeholder=" " className='float-input' required />
          <label htmlFor="phone" className='float-label'>Phone Number</label>
        </div>
        <div className="float-container">
          <input type="email" id="email" placeholder=" " className="float-input" required />
          <label htmlFor="email" className="float-label">Email Address</label>
        </div>
        <div className="pt-4">
          <button type='submit' className="submit-btn w-full">Add Agent</button>
        </div>
      </form>
    </div>
  )
}

export default AddUpdateAgent;