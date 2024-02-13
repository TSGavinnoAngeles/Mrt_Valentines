import React, { useState, useEffect } from 'react';
import HomeForm from './../screens/home/homeform';
import AdminNavigation from '../components/adminnav';


 
const Dashboard = () => {



    return (
      <div>
        <AdminNavigation />
        <p className = "text-center">
        <h1 className="text-3xl font-bold">
            Welcome to the Admin Dashboard.
        </h1>
        </p>
      </div>
    )


}

export default Dashboard;