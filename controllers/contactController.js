const contactController = {}

const mongodb = require('../database/connect')

contactController.getContacts = async (req, res) => {
    
    try {
        const database = mongodb.getDb().db('cse341');

        const collection = database.collection('contacts');

        const data = await collection.find({}).toArray();
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

contactController.getContactById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        // console.log(req.params.id)
        const database = mongodb.getDb().db('cse341');

        const collection = database.collection('contacts');

        const contact =  await collection.findOne({ "contact_id": id });
        if (!contact) {
            return res.status(404).json({ error: 'Contact not found' });
        }

        res.status(200).json(contact)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

contactController.buildContact = async (req, res) => {
    // render the createContact.html file
    // res.sendFile(path.join(__dirname, '../public/createContact.html'));
    res.render('/createContact', { title: 'Create Contact' });
}

contactController.createContact = async (req, res) => {
    try {
        console.log(req.body)
        const newContact = req.body;
        if (!newContact || !newContact.firstName || !newContact.email) {
            return res.status(400).json({ error: 'Invalid contact data' });
        }
        const database = mongodb.getDb().db('cse341');

        const collection = database.collection('contacts');

        // get the max id from the contacts collection (the contact_id field but do not create a contact array)
        const maxId = await collection.find({}).sort({ contact_id: -1 }).limit(1).toArray();
        // get the next id
        const nextId = maxId.length > 0 ? maxId[0].contact_id + 1 : 1;

        console.log(newContact)

        // insert new contact as a new document
        const result = await collection.insertOne({ ...newContact, contact_id: nextId });
        if (result.modifiedCount === 0) {
            return res.status(400).json({ error: 'Failed to create contact' });
        }
        // return the status code 201 and the new contact
        res.status(201).json({ message: 'Contact ' + nextId + ' created successfully' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

contactController.updateContact = async (req, res) => {
    try {
        console.log(req.body)
        const id = parseInt(req.params.id);
        const updatedContact = req.body;
        
        const database = mongodb.getDb().db('cse341');

        const collection = database.collection('contacts');

        // check if the contact exists
        const contact = await collection.findOne({ "contact_id": id });
        if (!contact) {
            return res.status(404).json({ error: 'Contact not found' });
        }
        // update the contact with the given id
        const result = await collection.updateOne({ "contact_id": id }, { $set: updatedContact });
        if (result.modifiedCount === 0) {
            return res.status(400).json({ error: 'Failed to update contact' });
        }
        // return the status code 200 and the updated contact
        res.status(200).json(updatedContact)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

contactController.deleteContact = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const database = mongodb.getDb().db('cse341');

        const collection = database.collection('contacts');

        // delete the contact with the given id
        const result = await collection.deleteOne({ "contact_id": id });
        if (result.modifiedCount === 0) {
            return res.status(400).json({ error: 'Failed to delete contact' });
        }
        res.status(200).json({ message: 'Contact deleted successfully' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

module.exports = contactController