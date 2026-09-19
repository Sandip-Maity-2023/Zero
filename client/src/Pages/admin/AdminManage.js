import { useEffect, useState } from 'react';
import axios from 'axios';

function AdminManage() {
  // add org parts

  // States to Store Data
  const [adminJobs, setAdminJobs] = useState(null);
  const [updateAdmin, setUpdateAdmin] = useState(
    {
      _id: null,
      // orgId:"",
      // orgName:"",
      // requestTitle:"",
      // population:"",
      // dueDate:"",
      // orgOtherDetails:"",
      // orgLocation:"",
      // orgTelephone:"",
      // donorId:"",
      // donorName:"",
      // donationSize:"",
      // deliveryMethod:"",
      // donorTelephone:"",
      // donorOtherDetails:"",
      // donorLocation:"",
      // volunteerId:"",
      // volunteerName:"",
      // NIC:"",
      // vehicleNo:"",
      // volunteerTelephoneNo:"",

      firstName: "",
      lastName: "",
      adminOrganizationName: "",
      adminRegNo: "",
      adminEmail: "",
      adminRole: "",
      adminPassword: "",
      adminOrgOrganizationName: "",
      adminOrgRegNo: "",
      adminOrgEmail: "",
      adminOrgRole: "",
      adminOrgPassword: ""
    }
  );

  // const adminId = "sampleAdminID";


  //UseEffect
  useEffect(() => {
    fetchAdminJobs();
  }, []);

  // Function to fetch Admin Jobs of a Single Volunteer
  const fetchAdminJobs = async () => {
    try {
      //Fetch Delivery Requests
      //const response = await axios.get(`http://localhost:4001/admin/approves/`);
      const response=await axios.get(`${process.env.APP_URL}/admin/approves/`);
      // const response = await axios.get(`http://localhost:4001/admin/approves/${adminId}`);

      //Set to State
      setAdminJobs(response.data);
    } catch (error) {

    }

  }

  //Toggle Decline Admin
  const toggleDeclineAdmin = async (adminJob) => {

    const deleteId = adminJob._id;

    //Delete Related Donor Record
    //const deleteResponse = await axios.delete(`http://localhost:4001/admin/approves/${deleteId}`);
    const deleteResponse=await axios.delete(`${process.env.APP_URL}/admin/approves/${deleteId}`);

    console.log(deleteResponse);

    if (deleteResponse) {

      const repostAdmin = {
        orgId: adminJob.orgId,
        orgName: adminJob.orgName,
        requestTitle: adminJob.requestTitle,
        population: adminJob.population,
        dueDate: adminJob.dueDate,
        orgOtherDetails: adminJob.orgOtherDetails,
        orgLocation: adminJob.orgLocation,
        orgTelephone: adminJob.orgTelephone,
        donorId: adminJob.donorId,
        donorName: adminJob.donorName,
        donationSize: adminJob.donationSize,
        deliveryMethod: adminJob.deliveryMethod,
        donorTelephone: adminJob.donorTelephone,
        donorOtherDetails: adminJob.donorOtherDetails,
        donorLocation: adminJob.donorLocation,

        firstName: adminJob.firstName,
        lastName: adminJob.lastName,
        adminOrganizationName: adminJob.adminOrganizationName,
        adminRegNo: adminJob.adminRegNo,
        adminEmail: adminJob.adminEmail,
        adminRole: adminJob.adminRole,
        adminPassword: adminJob.adminPassword,
        adminOrgOrganizationName: adminJob.adminOrgOrganizationName,
        adminOrgRegNo: adminJob.adminOrgRegNo,
        adminOrgEmail: adminJob.adminOrgEmail,
        adminOrgRole: adminJob.adminOrgRole,
        adminOrgPassword: adminJob.adminOrgPassword


      }

      //Send the create request
      try {
       // const response = await axios.post("http://localhost:4001/admin/approves/", repostAdmin);
        const response=await axios.post(`${process.env.APP_URL}/admin/approves/`,repostAdmin);

        console.log(response);
      } catch (error) {

      }


    }

    //Update the Admin Jobs List
    fetchAdminJobs();

  };

  //Toggle Edit Delivery
  const toggleUpdateAdmin = (adminJob) => {

    setUpdateAdmin({
      _id: adminJob._id,
      orgId: adminJob.orgId,
      orgName: adminJob.orgName,
      requestTitle: adminJob.requestTitle,
      population: adminJob.population,
      dueDate: adminJob.duedate,
      orgOtherDetails: adminJob.orgOtherDetails,
      orgLocation: adminJob.orgLocation,
      orgTelephone: adminJob.orgTelephone,
      donorId: adminJob.donorId,
      donorName: adminJob.donorName,
      donationSize: adminJob.donationSize,
      deliveryMethod: adminJob.deliveryMethod,
      donorTelephone: adminJob.donorTelephone,
      donorOtherDetails: adminJob.donorOtherDetails,
      donorLocation: adminJob.donorLocation,
      volunteerId: adminJob.volunteerId,
      volunteerName: adminJob.volunteerName,
      NIC: adminJob.NIC,
      vehicleNo: adminJob.vehicleNo,
      volunteerTelephoneNo: adminJob.volunteerTelephoneNo,

      firstName: adminJob.firstName,
      lastName: adminJob.lastName,
      adminOrganizationName: adminJob.adminOrganizationName,
      adminRegNo: adminJob.adminRegNo,
      adminEmail: adminJob.adminEmail,
      adminRole: adminJob.adminRole,
      adminPassword: adminJob.adminPassword,
      adminOrgOrganizationName: adminJob.adminOrgOrganizationName,
      adminOrgRegNo: adminJob.adminOrgRegNo,
      adminOrgEmail: adminJob.adminOrgEmail,
      adminOrgRole: adminJob.adminOrgRole,
      adminOrgPassword: adminJob.adminOrgPassword

    })
  };

  //Handle Update Field Change
  const handleUpdateFieldChange = (e) => {
    const { value, name } = e.target

    setUpdateAdmin({
      ...updateAdmin,
      [name]: value,
    })
    console.log(updateAdmin);

  };

  // Update Admin
  const updateAdminJob = async (e) => {
    e.preventDefault();

    const adminJobUpdateDetails = {
      orgId: updateAdmin.orgId,
      orgName: updateAdmin.orgName,
      requestTitle: updateAdmin.requestTitle,
      population: updateAdmin.population,
      dueDate: updateAdmin.duedate,
      orgOtherDetails: updateAdmin.orgOtherDetails,
      orgLocation: updateAdmin.orgLocation,
      orgTelephone: updateAdmin.orgTelephone,
      donorId: updateAdmin.donorId,
      donorName: updateAdmin.donorName,
      donationSize: updateAdmin.donationSize,
      deliveryMethod: updateAdmin.deliveryMethod,
      donorTelephone: updateAdmin.donorTelephone,
      donorOtherDetails: updateAdmin.donorOtherDetails,
      donorLocation: updateAdmin.donorLocation,
      volunteerId: updateAdmin.volunteerId,
      volunteerName: updateAdmin.volunteerName,
      NIC: updateAdmin.NIC,
      vehicleNo: updateAdmin.vehicleNo,
      volunteerTelephoneNo: updateAdmin.volunteerTelephoneNo,

      firstName: updateAdmin.firstName,
      lastName: updateAdmin.lastName,
      adminOrganizationName: updateAdmin.adminOrganizationName,
      adminRegNo: updateAdmin.adminRegNo,
      adminEmail: updateAdmin.adminEmail,
      adminRole: updateAdmin.adminRole,
      adminPassword: updateAdmin.adminPassword,
      adminOrgOrganizationName: updateAdmin.adminOrgOrganizationName,
      adminOrgRegNo: updateAdmin.adminOrgRegNo,
      adminOrgEmail: updateAdmin.adminOrgEmail,
      adminOrgRole: updateAdmin.adminOrgRole,
      adminOrgPassword: updateAdmin.adminOrgPassword
    };

    //Send the update request
   // const response = await axios.patch(`http://localhost:4001/admin/approves/${updateAdmin._id}`, adminJobUpdateDetails);
    const response =await axios.patch(`${process.env.APP_URL}/admin/approves/${updateAdmin._id}`,adminJobUpdateDetails);
    console.log(response);

    //Update the Admin Jobs List
    fetchAdminJobs();

    //Update the updateAdmin State
    setUpdateAdmin({
      _id: null,
      orgId: "",
      orgName: "",
      requestTitle: "",
      population: "",
      dueDate: "",
      orgOtherDetails: "",
      orgLocation: "",
      orgTelephone: "",
      donorId: "",
      donorName: "",
      donationSize: "",
      deliveryMethod: "",
      donorTelephone: "",
      donorOtherDetails: "",
      donorLocation: "",
      volunteerId: "",
      volunteerName: "",
      NIC: "",
      vehicleNo: "",
      volunteerTelephoneNo: "",

      firstName: "",
      lastName: "",
      adminOrganizationName: "",
      adminRegNo: "",
      adminEmail: "",
      adminRole: "",
      adminPassword: "",
      adminOrgOrganizationName: "",
      adminOrgRegNo: "",
      adminOrgEmail: "",
      adminOrgRole: "",
      adminOrgPassword: ""
    });
  };

  return (
    <div className="home">
      <div className="workouts">
        {adminJobs && adminJobs.map(adminJob => (
          <div className="workout-details" key={adminJob._id}>
            <h4>{adminJob.requestTitle}</h4>

            <p><strong>Organization Name : </strong>{adminJob.adminOrganizationName}</p>
            <p><strong>Reg No : </strong>{adminJob.adminRegNo}</p>
            <p><strong>Email : </strong>{adminJob.adminEmail}</p>
            {/* <p><strong>Organization Name : </strong>{adminJob.orgName}</p>
                <p><strong>Organization Telephone No. : </strong>{adminJob.orgTelephone}</p>
                <p><strong>Organization Location : </strong>{adminJob.orgLocation}</p>
                <p><strong>Due Date : </strong>{adminJob.dueDate}</p>
                
                <p><strong>Donor Name : </strong>{adminJob.donorName}</p>
                <p><strong>Donor Telephone No. : </strong>{adminJob.donorTelephone}</p>
                <p><strong>Donor Location : </strong>{adminJob.donorLocation}</p>
                <p><strong>Delivery Size : </strong>{adminJob.donationSize}</p>
                <p><strong>Extra Details : </strong>{adminJob.donorOtherDetails}</p>
                <hr/>
                <p><strong>Volunteer Name : </strong>{adminJob.volunteerName}</p>
                <p><strong>Volunteer NIC : </strong>{adminJob.NIC}</p>
                <p><strong>Volunteer Vehicle No. : </strong>{adminJob.vehicleNo}</p>
                <p><strong>Volunteer Telephone No. : </strong>{adminJob.volunteerTelephoneNo}</p> */}


            <span>
              <div><button onClick={() => toggleDeclineAdmin(adminJob)}>Decline Admin</button></div>
              <div><button onClick={() => toggleUpdateAdmin(adminJob)}>Edit Adnin</button></div>
              {/* onClick={() =>toggleAcceptAdmin(adninRequest)} */}
            </span>
          </div>
        ))}

      </div>

      <form className="create" onSubmit={updateAdminJob}>
        <h3>Edit a Admin Job</h3>
        <h4> {updateAdmin.requestTitle} </h4>


        {/* <label>Volunter Name:</label>
            <input 
              type="text" 
              name="volunteerName"
              onChange={handleUpdateFieldChange}
              value={updateAdmin.volunteerName}
            />

            <label>NIC No:</label>
            <input 
              type="text" 
              name="NIC"
              onChange={handleUpdateFieldChange}
              value={updateAdmin.NIC}
            />

            <label>Vehicle No:</label>
            <input 
              type="text" 
              name="vehicleNo"
              onChange={handleUpdateFieldChange}
              value={updateAdmin.vehicleNo}
            />

            <label>Telephone No:</label>
            <input 
              type="number" 
              name="volunteerTelephoneNo"
              onChange={handleUpdateFieldChange}
              value={updateAdmin.volunteerTelephoneNo}
            />

      <button>Update Delivery Job</button>
    </form> */}

        <label>Organization Name:</label>
        <input
          type="text"
          name="adminOrgName"
          onChange={handleUpdateFieldChange}
          value={updateAdmin.adminOrgName}
        />

        <label>Registration No:</label>
        <input
          type="text"
          name="adminRegno"
          onChange={handleUpdateFieldChange}
          value={updateAdmin.adminRegNo}
        />

        <label>Email Address:</label>
        <input
          type="text"
          name="adminEmail"
          onChange={handleUpdateFieldChange}
          value={updateAdmin.adminEmail}
        />

        <label>Role:</label>
        <input
          type="text"
          name="adminRole"
          onChange={handleUpdateFieldChange}
          value={updateAdmin.adminRole}
        />

        <label>Password:</label>
        <input
          type="text"
          name="adminPassword"
          onChange={handleUpdateFieldChange}
          value={updateAdmin.adminPassword}
        />

        <button>Update Organization</button>
      </form>
    </div>
  )
}

export default AdminManage;