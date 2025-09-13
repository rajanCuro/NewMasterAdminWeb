import React, { useEffect } from 'react'
import axiosInstance from '../../auth/axiosInstance'

function Pharmacy({ id }) {
  useEffect(() => {
    fetchData()

  }, [])

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`/api/field-executive/getAgentStatistics/${id}`)
      console.log(response.data)

    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div>Pharmacy</div>
  )
}

export default Pharmacy