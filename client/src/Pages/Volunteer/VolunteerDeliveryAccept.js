import { useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../../api';

function VolunteerDeliveryAccept () {


//Get All Delivery Requests from DB and Display them
    //#1 - Create a function to fetch Delivery Requests
    //#2 - Set the DeliveryRequests into a State
    //#3 - Create a UseEffect to Update Page everytime Refreshed
    //#4 - Create the Container for Delivery Request


//States to Store Data
const [deliveryRequests, setDeliveryRequests] = useState(null);
const[deliveryAccept,setDeliveryAccept] = useState({
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

//useEffect
useEffect(() => {
    fetchDeliveryRequests();
}, []);

useEffect(() => {
  console.log(deliveryAccept);
}, [deliveryAccept]);

 //Function to Fetch Delivery Requests
const fetchDeliveryRequests = async () =>{
  
    //Fetch Delivery Requests
    //const response = await axios.get("http://localhost:4000/donor/volunteer-delivery");
    const response = await axios.get(`${API_URL}/donor/volunteer-delivery`);

    //Set to State
    setDeliveryRequests(response.data);
  };

//Toggle Accept Delivery
const toggleAcceptDelivery = (deliveryRequest) =>{

  setDeliveryAccept({
    _id:deliveryRequest._id,
    orgId:deliveryRequest.orgId,
    orgName:deliveryRequest.orgName,
    requestTitle:deliveryRequest.requestTitle,
    population:deliveryRequest.population,
    dueDate:deliveryRequest.dueDate,
    orgOtherDetails:deliveryRequest.orgOtherDetails,
    orgLocation:deliveryRequest.orgLocation,
    orgTelephone:deliveryRequest.orgTelephone,
    donorId:deliveryRequest.donorId,
    donorName:deliveryRequest.donorName,
    donationSize:deliveryRequest.donationSize,
    deliveryMethod:deliveryRequest.deliveryMethod,
    donorTelephone:deliveryRequest.donorTelephone,
    donorOtherDetails:deliveryRequest.donorOtherDetails,
    donorLocation:deliveryRequest.donorLocation,
    volunteerId:"",
    volunteerName:"",
    NIC:"",
    vehicleNo:"",
    volunteerTelephoneNo:""
    })

    console.log(deliveryAccept);
}

//Handle Update Field Change
const handleAddFieldChange = (e) =>{
  const {value,name} = e.target

  setDeliveryAccept({
    ...deliveryAccept,
    [name]:value,
  })
  console.log(deliveryAccept);
}

// Create Delivery Job
const createDeliveryJob = async (e) => {
  e.preventDefault();

  //fetch delivery job details
  const deliveryJobDetails = {
    orgId:deliveryAccept.orgId,
    orgName:deliveryAccept.orgName,
    requestTitle:deliveryAccept.requestTitle,
    population:deliveryAccept.population,
    dueDate:deliveryAccept.dueDate,
    orgOtherDetails:deliveryAccept.orgOtherDetails,
    orgLocation:deliveryAccept.orgLocation,
    orgTelephone:deliveryAccept.orgTelephone,
    donorId:deliveryAccept.donorId,
    donorName:deliveryAccept.donorName,
    donationSize:deliveryAccept.donationSize,
    deliveryMethod:deliveryAccept.deliveryMethod,
    donorTelephone:deliveryAccept.donorTelephone,
    donorOtherDetails:deliveryAccept.donorOtherDetails,
    donorLocation:deliveryAccept.donorLocation,
    volunteerId:"sampleVolunteerID",
    volunteerName:deliveryAccept.volunteerName,
    NIC:deliveryAccept.NIC,
    vehicleNo:deliveryAccept.vehicleNo,
    volunteerTelephoneNo:deliveryAccept.volunteerTelephoneNo
  };

  //Send the create request
 // const response = await axios.post("http://localhost:4000/volunteer/delivery-jobs",deliveryJobDetails);
  const response = await axios.post(`${API_URL}/volunteer/delivery-jobs`, deliveryJobDetails);

  console.log(response); 

  //Delete Related Donor Record
  //const deleteResponse = await axios.delete(`http://localhost:4000/donor/${deliveryAccept._id}`);
  const deleteResponse = await axios.delete(`${API_URL}/donor/${deliveryAccept._id}`);
  
  if(deleteResponse){
  
    console.log(deleteResponse);
    alert("Volunteer Job Created");

  //Refresh Delivery Requests List

  fetchDeliveryRequests();

  //Clear Details From State
  setDeliveryAccept({
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
  }

}

  return (
    <div>
      <h2 id="page-title">Volunteer Job Acceptance</h2>
    <div className="home">
        <div className="workouts">
        <h3>Volunteer Requests</h3>
          {deliveryRequests && deliveryRequests.map(deliveryRequest => (
            <div className="workout-details" key={deliveryRequest._id}>
                <h4>{deliveryRequest.requestTitle}</h4>
                <p><strong>Organization Name : </strong>{deliveryRequest.orgName}</p>
                <p><strong>Organization Telephone No. : </strong>{deliveryRequest.orgTelephone}</p>
                <p><strong>Organization Location : </strong>{deliveryRequest.orgLocation}</p>
                <p><strong>Due Date : </strong>{deliveryRequest.dueDate}</p>
                <p><strong>Donor Name : </strong>{deliveryRequest.donorName}</p>
                <p><strong>Donor Telephone No. : </strong>{deliveryRequest.donorTelephone}</p>
                <p><strong>Donor Location : </strong>{deliveryRequest.donorLocation}</p>
                <p><strong>Delivery Size : </strong>{deliveryRequest.donationSize}</p>
                <p><strong>Extra Details : </strong>{deliveryRequest.donorOtherDetails}</p>
                <span>
                    {/*<div><button onClick={() =>deleteWorkout(workout._id)}>Delete</button></div>*/}
                    <div><button onClick={() =>toggleAcceptDelivery(deliveryRequest)}>Accept Delivery</button></div>
                    {/* onClick={() =>toggleAcceptDelivery(deliveryRequest)} */}
                </span>
            </div>
          ))}
        
        </div>

          <form className="create" onSubmit={createDeliveryJob}> 
            <h3>Accept a Volunteer Request</h3>
            <h4>Request Title : {deliveryAccept.requestTitle} </h4>
          

            <label>Volunter Name:</label>
            <input 
              type="text" 
              name="volunteerName"
              onChange={handleAddFieldChange}
              value={deliveryAccept.volunteerName}
              required
            />

            <label>NIC No:</label>
            <input 
              type="text" 
              name="NIC"
              onChange={handleAddFieldChange}
              value={deliveryAccept.NIC}
              required
            />

            <label>Vehicle No:</label>
            <input 
              type="text" 
              name="vehicleNo"
              onChange={handleAddFieldChange}
              value={deliveryAccept.vehicleNo}
              required
            />

            <label>Telephone No:</label>
            <input 
              type="number" 
              name="volunteerTelephoneNo"
              onChange={handleAddFieldChange}
              value={deliveryAccept.volunteerTelephoneNo}
              required
            />

      <button>Add Workout</button>
    </form>
        
    </div>
    </div>
        )

}

export default VolunteerDeliveryAccept;
