import React from 'react'

const ProfileInfo = ({ data}) => {
  return (

    <div>
        <h1>Profile Information</h1>
        <img src={data.profileImage} alt="profile" width={50} height={50} />
        <h2>Name: {data.name}</h2>
        <h2>Email: {data.email}</h2>
        <h2>Role: {data.role}</h2>
        <h2>Birth Date: {data.birthDate}</h2>
    </div>
    
  )
}

export default ProfileInfo