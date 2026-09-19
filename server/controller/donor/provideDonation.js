const ProvideDonation = require('../../models/donor/provideDonation')
const mongoose = require('mongoose')

// Get all donations
const getProvideDonations = async (req, res) => {
    try {
        const donations = await ProvideDonation.find({}).sort({ createdAt: -1 })
        res.status(200).json(donations)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// Get all unassigned Volunteer Delivery Jobs for couriers
const getDonorVolunteerDelivery = async (req, res) => {
    try {
        const jobs = await ProvideDonation.find({
            deliveryMethod: "volunteer-delivery",
            status: 'pending'
        }).sort({ createdAt: -1 })

        res.status(200).json(jobs)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// Get donations by specific donor ID
const getDonorDonations = async (req, res) => {
    const { donorId } = req.params
    try {
        const donations = await ProvideDonation.find({ donorId }).sort({ createdAt: -1 })
        res.status(200).json(donations)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// Get a single donation
const getProvideDonation = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No Such Donation' })
    }
    const donation = await ProvideDonation.findById(id)

    if (!donation) {
        return res.status(404).json({ error: 'No Such Donation' })
    }
    res.status(200).json(donation)
}

// Create a new donation
const createProvideDonation = async (req, res) => {
    const {
        orgId,
        orgName,
        requestTitle,
        population,
        dueDate,
        orgOtherDetails,
        orgLocation,
        orgTelephone,
        donorId,
        donorName,
        donationSize,
        deliveryMethod,
        donorTelephone,
        donorOtherDetails,
        donorLocation
    } = req.body

    const finalDonorId = donorId || (req.user ? req.user._id.toString() : 'donor-user');
    const finalDonorName = donorName || (req.user ? (req.user.firstName ? `${req.user.firstName} ${req.user.lastName || ''}`.trim() : req.user.orgName || req.user.email) : 'Generous Donor');

    try {
        const newDonation = await ProvideDonation.create({
            orgId: orgId || 'open-community',
            orgName: orgName || 'Community Food Shelter',
            requestTitle: requestTitle || 'Direct Food Aid Donation',
            population: population || '50',
            dueDate: dueDate || new Date(),
            orgOtherDetails: orgOtherDetails || 'Direct donor contribution',
            orgLocation: orgLocation || 'Community Distribution Hub',
            orgTelephone: Number(orgTelephone) || 0,
            donorId: finalDonorId,
            donorName: finalDonorName,
            donationSize,
            deliveryMethod: deliveryMethod || 'volunteer-delivery',
            donorTelephone: Number(donorTelephone),
            donorOtherDetails: donorOtherDetails || 'None',
            donorLocation,
            status: 'pending'
        })
        res.status(200).json(newDonation)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// Delete a donation
const deleteProvideDonation = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No Such Donation' })
    }
    const donation = await ProvideDonation.findOneAndDelete({ _id: id })

    if (!donation) {
        return res.status(400).json({ error: 'No Such Donation' })
    }

    res.status(200).json(donation)
}

// Update a donation
const updateProvideDonation = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No Such Donation' })
    }
    const donation = await ProvideDonation.findByIdAndUpdate({ _id: id }, {
        ...req.body
    }, { new: true })

    if (!donation) {
        return res.status(400).json({ error: 'No Such Donation' })
    }

    res.status(200).json(donation)
}

module.exports = {
    getProvideDonation,
    getProvideDonations,
    createProvideDonation,
    deleteProvideDonation,
    updateProvideDonation,
    getDonorVolunteerDelivery,
    getDonorDonations
}