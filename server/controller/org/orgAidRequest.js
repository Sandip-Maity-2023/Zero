//Workout Model imported
const OrgAidRequest = require('../../models/org/orgAidRequest')
const mongoose = require('mongoose')

// get all Org jobs
const getOrgJobs = async (req, res) => {
    const OrgJob = await OrgAidRequest.find({}).sort({ createdAt: -1 })

    res.status(200).json(OrgJob)

}




// get a single Org job
const getOrgJob = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No Such Org Job' })
    }
    const OrgJob = await OrgAidRequest.findById(id)

    if (!OrgJob) {
        return res.status(404).json({ error: 'No Such Org Job' })

    }
    res.status(200).json(OrgJob)
}

// create a new OrgJob
const createOrgJob = async (req, res) => {
    const {
        orgId,
        orgName,
        requestTitle,
        population,
        dueDate,
        orgOtherDetails,
        orgLocation,
        orgTelephone
    } = req.body

    const finalOrgId = orgId || (req.user ? req.user._id.toString() : 'org-user');
    const finalOrgName = orgName || (req.user ? (req.user.orgName || `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim()) : 'Organization');

    try {
        const newOrgAidRequest = await OrgAidRequest.create({
            orgId: finalOrgId,
            orgName: finalOrgName,
            requestTitle,
            population,
            dueDate,
            orgOtherDetails: orgOtherDetails || 'None',
            orgLocation,
            orgTelephone
        })
        res.status(200).json(newOrgAidRequest)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// delete a OrgJob
const deleteOrgJob = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No Such Org Job' })
    }
    const OrgJob = await OrgAidRequest.findOneAndDelete({ _id: id })

    if (!OrgJob) {
        return res.status(400).json({ error: 'No Such Org Job' })
    }

    res.status(200).json(OrgJob)

}


// update a workout
const updateOrgJob = async (req, res) => {

    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No Such Workout' })
    }
    const OrgJob = await OrgAidRequest.findByIdAndUpdate({ _id: id }, {
        ...req.body
    })

    if (!OrgJob) {
        return res.status(400).json({ error: 'No Such Workout' })
    }

    res.status(200).json(OrgJob)

}

module.exports = {
    getOrgJob,
    getOrgJobs,
    createOrgJob,
    deleteOrgJob,
    updateOrgJob
}