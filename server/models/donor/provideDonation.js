const mongoose = require('mongoose')

const Schema = mongoose.Schema

const orgAidSchema = new Schema({
    orgId: {
        type: String,
        default: 'open-community'
    },
    orgName: {
        type: String,
        default: 'Community Food Shelter'
    },
    requestTitle: {
        type: String,
        default: 'Direct Food Aid Donation'
    },
    population: {
        type: String,
        default: '50'
    },
    dueDate: {
        type: Date,
        default: Date.now
    },
    orgOtherDetails: {
        type: String,
        default: 'Direct donor contribution'
    },
    orgLocation: {
        type: String,
        default: 'Community Distribution Hub'
    },
    orgTelephone: {
        type: Number,
        default: 0
    },
    donorId: {
        type: String,
        required: true
    },
    donorName: {
        type: String,
        required: true
    },
    donationSize: {
        type: String,
        required: true
    },
    deliveryMethod: {
        type: String,
        required: true,
        default: 'volunteer-delivery'
    },
    donorTelephone: {
        type: Number,
        required: true
    },
    donorOtherDetails: {
        type: String,
        default: 'None'
    },
    donorLocation: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'in-transit', 'delivered'],
        default: 'pending'
    },
    volunteerId: {
        type: String,
        default: ''
    },
    volunteerName: {
        type: String,
        default: ''
    },
    volunteerTelephoneNo: {
        type: String,
        default: ''
    },
    vehicleNo: {
        type: String,
        default: ''
    }
}, { timestamps: true })

module.exports = mongoose.model('provideDonation', orgAidSchema)