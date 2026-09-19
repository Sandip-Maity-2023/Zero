import { useEffect, useState } from 'react';
import axios from 'axios';

function AdminAccept () {


//Get All Unreigsted Organizations from DB and Display them
    //#1 - Create a function to fetch Unreigsted Organizations
    //#2 - Set the Unreigsted Organizations into a State
    //#3 - Create a UseEffect to Update Page everytime Refreshed
    //#4 - Create the Container for Unreigsted Organizations


//States to Store Data
const [unreOrgs, setUnregOrgs] = useState([]);
const [adminJobs,setAdminJobs] = useState([]);
const[unregOrgsAccept,setUnregOrgsAccept] = useState({
_id:null,
adminOrganizationName:"",
adminRegNo:"",
adminEmail:"",
adminRole:"",
adminPassword:"",
adminOrgOrganizationName:"",
adminOrgRegNo:"",
adminOrgEmail:"",
adminOrgRole:"",
adminOrgPassword:""
}
);

//useEffect
useEffect(() => {
    fetchUnregOrgs();
}, []);

useEffect(() => {
  console.log(unregOrgsAccept);
}, [unregOrgsAccept]);

 //Function to Fetch Delivery Requests
const fetchUnregOrgs = async () =>{
  
    //Fetch Delivery Requests
    try {
      //const response = await axios.get("http://localhost:4000/adminOrg/accepts/");
      const response=await axios.get(`${process.env.APP_URL}/adminOrg/accepts`);
      //Set to State
      if (response) {
        setUnregOrgs(response.data);
        
      }
    } catch (error) {
      
    }
   
  };


//

//UseEffect
useEffect(() =>{
  fetchAdminJobs();
},[]);

// Function to fetch Admin Jobs of a Single Volunteer
const fetchAdminJobs = async () => {

  //Fetch Delivery Requests
  try {
    //const response = await axios.get(`http://localhost:4000/admin/approves/`);
    const response =await axios.get(`${process.env.APP_URL}/admin/approves/`);
  // const response = await axios.get(`http://localhost:4000/admin/approves/${adminId}`);

  //Set to State
    
    setAdminJobs(response.data);
  } catch (error) {
    
  }
  
}

//


//Toggle Accept Delivery
const toggleAcceptUnregOrgs = async (unreOrgs) =>{
  const adminOrg = {
    _id:unreOrgs._id,
    adminOrganizationName:unreOrgs.adminOrgOrganizationName,
    adminRegNo:unreOrgs.adminOrgRegNo,
    adminEmail:unreOrgs.adminOrgEmail,
    adminRole:"ORG",
    adminPassword:unreOrgs.adminOrgPassword
  }

    //Send the create request
    try {
     // const response = await axios.post("http://localhost:4000/admin/approves/",adminOrg);
      const response = await axios.post(`${process.env.APP_URL}/admin/approves/`,adminOrg);
      console.log(response); 
    } catch (error) {
      console.log(error,"errors");
    }
   

    //Delete Related Donor Record
    try {
     // const deleteResponse = await axios.delete(`http://localhost:4000/adminOrg/accepts/${unreOrgs._id}`);
      const deleteResponse=await axios.delete(`${process.env.APP_URL}/adminOrg/accepts/${unreOrgs._id}`);
      console.log(deleteResponse);
      // window.location.reload();
    } catch (error) {
      
    }
   
}

//Toggle Accept Delivery
const toggleRejectUnregOrgs = async (unreOrgs) =>{
    //const deleteResponse = await axios.delete(`http://localhost:4000/adminOrg/accepts/${unreOrgs._id}`);
    const deleteResponse =await axios.delete(`${process.env.APP_URL}/adminOrg/accepts/${unreOrgs._id}`);
    
    window.location.reload();
}

const toggleDeclineAdmin = async (adminJob) =>{
  //const deleteResponse = await axios.delete(`http://localhost:4000/admin/approves/${adminJob._id}`);
  const deleteResponse=await axios.delete(`${process.env.APP_URL}/admin/approves/${adminJob._id}`);
    
  window.location.reload();
}

const toggleUpdateAdmin = (unreOrgs) =>{
  setUnregOrgsAccept({
    _id:unreOrgs._id,
    adminOrganizationName:unreOrgs.adminOrganizationName,
    adminRegNo:unreOrgs.adminRegNo,
    adminEmail:unreOrgs.adminEmail,
    adminRole:unreOrgs.adminRole,
    adminPassword:unreOrgs.adminPassword
  });
}

//Handle Update Field Change
const handleAddFieldChange = (e) =>{
  const {value,name} = e.target

  setUnregOrgsAccept({
    ...unregOrgsAccept,
    [name]:value,
  })
  console.log(unregOrgsAccept);
}

// Create Delivery Job
const createAdminOrgJob = async (e) => {
  e.preventDefault();

  if(unregOrgsAccept._id) {
    const adminOrgJobDetails = {
      _id: unregOrgsAccept._id,
      adminOrganizationName:unregOrgsAccept.adminOrganizationName,
      adminRegNo:unregOrgsAccept.adminRegNo,
      adminEmail:unregOrgsAccept.adminEmail,
      adminRole:unregOrgsAccept.adminRole,
      adminPassword:unregOrgsAccept.adminPassword
    };
try {
 // const response = await axios.patch(`http://localhost:4000/admin/approves/${unregOrgsAccept._id}`,adminOrgJobDetails);
  const response=await axios.patch(`${process.env.APP_URL}/admin/approves/${unregOrgsAccept._id}`,adminOrgJobDetails);
  
} catch (error) {
  
}
  } else {
    const adminOrgJobDetails = {
      adminOrgOrganizationName:unregOrgsAccept.adminOrganizationName,
      adminOrgRegNo:unregOrgsAccept.adminRegNo,
      adminOrgEmail:unregOrgsAccept.adminEmail,
      adminOrgRole:"ORG",
      adminOrgPassword:unregOrgsAccept.adminPassword
    };
try {
  //const response = await axios.post("http://localhost:4000/adminOrg/accepts/",adminOrgJobDetails);
  const response=await axios.post(`${process.env.APP_URL}/adminOrg/accepts/`,adminOrgJobDetails);
  
} catch (error) {
  
}
  }

  //Refresh Delivery Requests List
  await fetchUnregOrgs();

  await fetchAdminJobs();

  //Clear Details From State
  setUnregOrgsAccept({
    _id:null,
    adminOrganizationName:"",
    adminRegNo:"",
    adminEmail:"",
    adminRole:"",
    adminPassword:"",
    adminOrgOrganizationName:"",
    adminOrgRegNo:"",
    adminOrgEmail:"",
    adminOrgRole:"",
    adminOrgPassword:""
  });

}

  return (
    <div className="home">
        <div className="workouts">
        <h1>Unreigsted Organizations</h1>
          {unreOrgs && unreOrgs.map(unreOrg => {
            return(
            <div className="workout-details" key={unreOrg._id}>
                
                <h2><strong></strong>{unreOrg.adminOrgOrganizationName}</h2>
                <p><strong>Reg No : </strong>{unreOrg.adminOrgRegNo}</p>
                <p><strong>Email</strong>{unreOrg.adminOrgEmail}</p>
                <p><strong>Role :</strong>{unreOrg.adminOrgRole}</p>
                <span>
                    
                    <div><button  onClick={async() => await toggleAcceptUnregOrgs(unreOrg)}>Accept</button></div>
                    <div><button onClick={async() =>await toggleRejectUnregOrgs(unreOrg)}>Reject</button></div>
                    
                </span>
            </div>
            );
          })}

        <h1>Registed Organizations</h1>    
          {adminJobs && adminJobs.map(adminJob => (
            <div className="workout-details" key={adminJob._id}>

                <h2><strong></strong>{adminJob.adminOrganizationName}</h2>
                
                <p><strong>Reg No : </strong>{adminJob.adminRegNo}</p>
                <p><strong>Email : </strong>{adminJob.adminEmail}</p>
                <p><strong>Role :</strong>{adminJob.adminRole}</p>

                <span>
                    <div><button onClick={async () =>await toggleDeclineAdmin(adminJob)}>Decline</button></div>
                    <div><button onClick={() =>toggleUpdateAdmin(adminJob)}>Edit</button></div>
                    {/* onClick={() =>toggleAcceptAdmin(adninRequest)} */}
                </span>
            </div>
          ))}


        
        </div>
        

          <form className="create" onSubmit={createAdminOrgJob}> 
            <h1>Add/Edit Organization</h1>
            <h4>{unregOrgsAccept.requestTitle} </h4>
            
            <label>Organization Name:</label>
            <input 
              type="text" 
              name="adminOrganizationName"
              onChange={handleAddFieldChange}
              value={unregOrgsAccept.adminOrganizationName}
            />

            <label>Registration No:</label>
            <input 
              type="text" 
              name="adminRegNo"
              onChange={handleAddFieldChange}
              value={unregOrgsAccept.adminRegNo}
            />

            <label>Email Address:</label>
            <input 
              type="text" 
              name="adminEmail"
              onChange={handleAddFieldChange}
              value={unregOrgsAccept.adminEmail}
            />

            <label>Password:</label>
            <input 
              type="text" 
              name="adminPassword"
              onChange={handleAddFieldChange}
              value={unregOrgsAccept.adminPassword}
            />

      <button>Add Organization</button>
      <button>Update Organization</button>
    </form>
      
    </div>
        )

}

export default AdminAccept;