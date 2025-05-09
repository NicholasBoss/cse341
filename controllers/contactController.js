const contactController = {}

const mongodb = require('../database/connect')

contactController.getContacts = async (req, res) => {
    
    try {
        const database = mongodb.getDb().db('cse341');

        const collection = database.collection('contacts');

        const data = await collection.findOne();
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

        let contact =  await collection.findOne({ "contacts.id": id });
        if (!contact) {
            return res.status(404).json({ error: 'Contact not found' });
        }
        contact = contact.contacts.find(contact => contact.id === id);

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

        const doc = await collection.findOne({});

        const maxId = doc.contacts.reduce((max, c) => Math.max(max, c.id || 0), 0);
        const nextId = maxId + 1;
        // console.log(nextId)

        newContact.id = parseInt(nextId);

        console.log(newContact)

        const result = await collection.updateOne({}, { $push: { contacts: newContact } });
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
        // change updatedContact.id to a number
        updatedContact.id = parseInt(updatedContact.id);
        
        if (parseInt(updatedContact.id) !== id) {
            return res.status(400).json({ error: 'Contact ID mismatch' });
        }
        const database = mongodb.getDb().db('cse341');

        const collection = database.collection('contacts');

        const result = await collection.updateOne({ "contacts.id": id }, { $set: { "contacts.$": updatedContact } });
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

        const result = await collection.updateOne({}, { $pull: { contacts: { id: id } } });
        if (result.modifiedCount === 0) {
            return res.status(400).json({ error: 'Failed to delete contact' });
        }
        res.status(200).json({ message: 'Contact deleted successfully' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

module.exports = contactController