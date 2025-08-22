import React from 'react'

function ChangePassword({userData}) {
    return (
        <div>
            <form action="">
                <div className="float-container">
                    <input
                        value={userData.username}
                        // onChange={(e) => setUsername(e.target.value)}
                        type="email"
                        id="email"
                        placeholder=" "
                        className="float-input"
                        required
                    />
                    <label htmlFor="email" className="float-label">Email Address</label>
                </div>
                <button></button>
            </form>
        </div>
    )
}

export default ChangePassword