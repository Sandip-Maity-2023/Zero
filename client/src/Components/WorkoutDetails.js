import { useEffect, useState } from 'react';
import axios from 'axios';

const WorkoutDetails = ({ workout }) => {//destructure from the props - workout

 // State to store Fetched Workouts
const [workouts, setWorkouts] = useState(null)
const [title,setTitle] = useState('')
const [load, setLoad] = useState('')
  const [reps, setReps] = useState('')

//useEffect
useEffect(() => {
  fetchWorkouts();
}, []);

//Functions
//Function to Fetch Workouts
const fetchWorkouts = async () =>{
  
  //Fetch workouts
//const response = await axios.get("http://localhost:4000/api/workouts");
const response=await axios.get(`${process.env.APP_URL}/api/workouts`);
//Set to State
  setWorkouts(response.data);
};



  const deleteWorkout = async (_id) => {

    //Delete the Workout
    //const response = await axios.delete(`http://localhost:4000/api/workouts/${_id}`)
    const response=await axios.delete(`${process.env.APP_URL}/api/workouts/${_id}`);
    console.log("Hello");
    //Update State
    const newWorkouts = [...workouts].filter((workout) =>{
      return workout._id != _id;
    });

    setWorkouts(newWorkouts);
  };
    return (
      <div className="workout-details">
        <h4>{workout.title}</h4>
        <p><strong>Load (kg): </strong>{workout.load}</p>
        <p><strong>Number of reps: </strong>{workout.reps}</p>
        <p>{workout.createdAt}</p>
        <span>
          <div><button onClick={() =>deleteWorkout(workout._id)}>Delete</button></div>
          <div><button>Edit</button></div>
        </span>
      </div>
    )
  } 
  
  export default WorkoutDetails