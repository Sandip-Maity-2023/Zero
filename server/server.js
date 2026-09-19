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
const authRoutes = require('./routes/authRoutes')
const requireAuth = require('./middleware/auth')

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
    app.get('/api/health', (req, res) => {
        res.status(200).json({
            status: 'ok',
            service: 'ZeroHunger Backend API',
            database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
            timestamp: new Date().toISOString()
        })
    })

    app.use('/auth', authRoutes)
    app.use('/api/workouts', requireAuth, workoutRoutes)
    // Volunteer Route
    app.use('/volunteer/delivery-jobs', requireAuth, volunteerRoutes)
    // Admin Route
    app.use('/admin/approves', requireAuth, adminRoutes)
    // Organization Route
    app.use('/org', requireAuth, orgRoutes)
    // Donor Route
    app.use('/donor', requireAuth, donorRoutes)

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
