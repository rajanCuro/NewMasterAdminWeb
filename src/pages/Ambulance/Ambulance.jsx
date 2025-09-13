import React, { useEffect } from 'react'
import axiosInstance from '../../auth/axiosInstance'

function Ambulance({ id }) {

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
    <div>Ambulance</div>
  )
}

export default Ambulance