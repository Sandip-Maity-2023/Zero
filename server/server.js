require('dotenv').config() 

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

//routes
const workoutRoutes = require('./routes/workouts')
const volunteerRoutes = require('./routes/volunteerRoutes')
const adminRoutes = require('./routes/adminRoutes')
const orgRoutes = require('./routes/org/orgAidRequest.js')
const donorRoutes = require('./routes/donor/provideDonation')

//express app
const app = express();
const PORT = process.env.PORT || 4000;

// //middleware
app.use(express.json())
app.use(cors())

app.use((req,res,next)=>{
    console.log(req.path,req.method)
    next()
})


// //routes
    app.use('/api/workouts',workoutRoutes)
    // Volunteer Route
    app.use('/volunteer/delivery-jobs',volunteerRoutes)
    // Admin Route
    app.use('/admin/approves',adminRoutes)
    // Organization Route
    app.use('/org',orgRoutes)
    // Donor Route
    app.use('/donor',donorRoutes)

//Connect to db
mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        //listen for requests
        const server = app.listen(PORT, () => {
            console.log('connected to DB & listening on port', PORT)
        });

        server.on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                console.error(`Port ${PORT} is already in use. Stop the running server or set another PORT in .env.`);
                process.exit(1);
            }

            throw error;
        });
    })
    .catch((error) => {
        console.log(error)
    })

// process.env
