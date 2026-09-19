const express = require('express')
const router = express.Router()
const {
    getProvideDonation,
    getProvideDonations,
    createProvideDonation,
    deleteProvideDonation,
    updateProvideDonation,
    getDonorVolunteerDelivery,
    getDonorDonations
} = require('../../controller/donor/provideDonation')

// Get all donations
router.get('/', getProvideDonations)

// Get all unassigned volunteer deliveries
router.get('/volunteer-delivery', getDonorVolunteerDelivery)

// Get donations by donor ID
router.get('/user-donations/:donorId', getDonorDonations)

// Get a single donation
router.get('/:id', getProvideDonation)

// POST a new donation
router.post('/', createProvideDonation)

// Delete a donation
router.delete('/:id', deleteProvideDonation)

// Update a donation
router.patch('/:id', updateProvideDonation)

module.exports = router;