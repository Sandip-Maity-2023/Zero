import { useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../../api';

function VolunteerMgmt () {

// States to Store Data
const [volunteerJobs,setVolunteerJobs] = useState(null);
const [updateDelivery,setUpdateDelivery] = useState(
  {
    _id:null,
    orgId:"",
    orgName:"",
    requestTitle:"",
    population:"",
    dueDate:"",
    orgOtherDetails:"",
    orgLocation:"",
    orgTelephone:"",
    donorId:"",
    donorName:"",
    donationSize:"",
    deliveryMethod:"",
    donorTelephone:"",
    donorOtherDetails:"",
    donorLocation:"",
    volunteerId:"",
    volunteerName:"",
    NIC:"",
    vehicleNo:"",
    volunteerTelephoneNo:""
  }
);

const volunteerId = "sampleVolunteerID";


//UseEffect
useEffect(() =>{
    fetchVolunteerJobs();
},[]);

useEffect(() => {
  console.log(updateDelivery);
}, [updateDelivery]);

// Function to fetch Delivery Jobs of a Single Volunteer
const fetchVolunteerJobs = async () => {

    //Fetch Delivery Requests
   // const response = await axios.get(`http://localhost:4000/volunteer/delivery-jobs/user-jobs/${volunteerId}`);
    const response = await axios.get(`${API_URL}/volunteer/delivery-jobs/user-jobs/${volunteerId}`);

    //Set to State
    setVolunteerJobs(response.data);
}

//Toggle Decline Delivery
const toggleDeclineDelivery =  async (volunteerJob) =>{

  const deleteId = volunteerJob._id;
  
  //Delete Related Donor Record
  //const deleteResponse = await axios.delete(`http://localhost:4000/volunteer/delivery-jobs/${deleteId}`);
  const deleteResponse = await axios.delete(`${API_URL}/volunteer/delivery-jobs/${deleteId}`);

  console.log(deleteResponse);

  if (deleteResponse){

      const repostDonation = {
          orgId:volunteerJob.orgId,
          orgName:volunteerJob.orgName,
          requestTitle:volunteerJob.requestTitle,
          population:volunteerJob.population,
          dueDate:volunteerJob.dueDate,
          orgOtherDetails:volunteerJob.orgOtherDetails,
          orgLocation:volunteerJob.orgLocation,
          orgTelephone:volunteerJob.orgTelephone,
          donorId:volunteerJob.donorId,
          donorName:volunteerJob.donorName,
          donationSize:volunteerJob.donationSize,
          deliveryMethod:volunteerJob.deliveryMethod,
          donorTelephone:volunteerJob.donorTelephone,
          donorOtherDetails:volunteerJob.donorOtherDetails,
          donorLocation:volunteerJob.donorLocation
  }

  //Send the create request
 // const response = await axios.post("http://localhost:4000/donor",repostDonation);
  const response = await axios.post(`${API_URL}/donor`, repostDonation);
  
  if(response){
  console.log(response);
  alert("Volunteer Job Deleted");
  //Update the Delivery Jobs List
  fetchVolunteerJobs();
  }
    }
  
  
  
};

//Toggle Edit Delivery
const toggleUpdateDelivery = (volunteerJob) =>{

  setUpdateDelivery({
    _id:volunteerJob._id,
    orgId:volunteerJob.orgId,
    orgName:volunteerJob.orgName,
    requestTitle:volunteerJob.requestTitle,
    population:volunteerJob.population,
    dueDate:volunteerJob.dueDate,
    orgOtherDetails:volunteerJob.orgOtherDetails,
    orgLocation:volunteerJob.orgLocation,
    orgTelephone:volunteerJob.orgTelephone,
    donorId:volunteerJob.donorId,
    donorName:volunteerJob.donorName,
    donationSize:volunteerJob.donationSize,
    deliveryMethod:volunteerJob.deliveryMethod,
    donorTelephone:volunteerJob.donorTelephone,
    donorOtherDetails:volunteerJob.donorOtherDetails,
    donorLocation:volunteerJob.donorLocation,
    volunteerId:volunteerJob.volunteerId,
    volunteerName:volunteerJob.volunteerName,
    NIC:volunteerJob.NIC,
    vehicleNo:volunteerJob.vehicleNo,
    volunteerTelephoneNo:volunteerJob.volunteerTelephoneNo
  })
};

//Handle Update Field Change
const handleUpdateFieldChange = (e) =>{
  const {value,name} = e.target

  setUpdateDelivery({
    ...updateDelivery,
    [name]:value,
  })
  console.log(updateDelivery);

};

// Update Delivery
const updateDeliveryJob = async (e) => {
  e.preventDefault();

  const deliveryJobUpdateDetails = {
    orgId:updateDelivery.orgId,
    orgName:updateDelivery.orgName,
    requestTitle:updateDelivery.requestTitle,
    population:updateDelivery.population,
    dueDate:updateDelivery.dueDate,
    orgOtherDetails:updateDelivery.orgOtherDetails,
    orgLocation:updateDelivery.orgLocation,
    orgTelephone:updateDelivery.orgTelephone,
    donorId:updateDelivery.donorId,
    donorName:updateDelivery.donorName,
    donationSize:updateDelivery.donationSize,
    deliveryMethod:updateDelivery.deliveryMethod,
    donorTelephone:updateDelivery.donorTelephone,
    donorOtherDetails:updateDelivery.donorOtherDetails,
    donorLocation:updateDelivery.donorLocation,
    volunteerId:updateDelivery.volunteerId,
    volunteerName:updateDelivery.volunteerName,
    NIC:updateDelivery.NIC,
    vehicleNo:updateDelivery.vehicleNo,
    volunteerTelephoneNo:updateDelivery.volunteerTelephoneNo};

    //Send the update request
   // const response = await axios.patch(`http://localhost:4000/volunteer/delivery-jobs/${updateDelivery._id}`,deliveryJobUpdateDetails)
    const response = await axios.patch(`${API_URL}/volunteer/delivery-jobs/${updateDelivery._id}`, deliveryJobUpdateDetails)
   
   
   if(response){
    console.log(response);
    alert("Volunteer Details Updated")

    //Update the Delivery Jobs List
    fetchVolunteerJobs();

    //Update the updateDelivery State
    setUpdateDelivery({
      _id:null,
      orgId:"",
      orgName:"",
      requestTitle:"",
      population:"",
      dueDate:"",
      orgOtherDetails:"",
      orgLocation:"",
      orgTelephone:"",
      donorId:"",
      donorName:"",
      donationSize:"",
      deliveryMethod:"",
      donorTelephone:"",
      donorOtherDetails:"",
      donorLocation:"",
      volunteerId:"",
      volunteerName:"",
      NIC:"",
      vehicleNo:"",
      volunteerTelephoneNo:""
    });

  }
};

return (
  <div><h2 id="page-title">Volunteer Job Management</h2>
    <div className="home ">
      
        <div className="workouts">
        <h3>Accepted Volunteer Jobs</h3>
          {volunteerJobs && volunteerJobs.map(volunteerJob => (
            <div className="workout-details" key={volunteerJob._id}>
                <h4>{volunteerJob.requestTitle}</h4>
                <p><strong>Organization Name : </strong>{volunteerJob.orgName}</p>
                <p><strong>Organization Telephone No. : </strong>{volunteerJob.orgTelephone}</p>
                <p><strong>Organization Location : </strong>{volunteerJob.orgLocation}</p>
                <p><strong>Due Date : </strong>{volunteerJob.dueDate}</p>
                
                <p><strong>Donor Name : </strong>{volunteerJob.donorName}</p>
                <p><strong>Donor Telephone No. : </strong>{volunteerJob.donorTelephone}</p>
                <p><strong>Donor Location : </strong>{volunteerJob.donorLocation}</p>
                <p><strong>Delivery Size : </strong>{volunteerJob.donationSize}</p>
                <p><strong>Extra Details : </strong>{volunteerJob.donorOtherDetails}</p>
                <hr/>
                <p><strong>Volunteer Name : </strong>{volunteerJob.volunteerName}</p>
                <p><strong>Volunteer NIC : </strong>{volunteerJob.NIC}</p>
                <p><strong>Volunteer Vehicle No. : </strong>{volunteerJob.vehicleNo}</p>
                <p><strong>Volunteer Telephone No. : </strong>{volunteerJob.volunteerTelephoneNo}</p>


                <span>
                    <div><button onClick={() =>toggleDeclineDelivery(volunteerJob)}>Decline Delivery</button></div>
                    <div><button onClick={() =>toggleUpdateDelivery(volunteerJob)}>Edit Delivery</button></div>
                    {/* onClick={() =>toggleAcceptDelivery(deliveryRequest)} */}
                </span>
            </div>
          ))}
        
        </div>

          <form className="create" onSubmit={updateDeliveryJob}> 
            <h3>Edit a Delivery Job</h3>
            <h4>Request Title : {updateDelivery.requestTitle} </h4>
          

            <label>Volunter Name:</label>
            <input 
              type="text" 
              name="volunteerName"
              onChange={handleUpdateFieldChange}
              value={updateDelivery.volunteerName}
              required
            />

            <label>NIC No:</label>
            <input 
              type="text" 
              name="NIC"
              onChange={handleUpdateFieldChange}
              value={updateDelivery.NIC}
              required
            />

            <label>Vehicle No:</label>
            <input 
              type="text" 
              name="vehicleNo"
              onChange={handleUpdateFieldChange}
              value={updateDelivery.vehicleNo}
              required
            />

            <label>Telephone No:</label>
            <input 
              type="number" 
              name="volunteerTelephoneNo"
              onChange={handleUpdateFieldChange}
              value={updateDelivery.volunteerTelephoneNo}
              required
            />

      <button>Update Delivery Job</button>
    </form>
        
    </div>
    </div>
        )


}

export default VolunteerMgmt;
