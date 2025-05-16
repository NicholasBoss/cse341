const contactController = {}

const { ObjectId } = require('mongodb');
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
        let id = req.params.id;
        const isNumber = !isNaN(id);
        const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
        if (isNumber) { 
            id = parseInt(id);
            console.log('id is a number')
            console.log(id)
        } else if (isObjectId) {
            id = id;
            console.log('id is a string')
            console.log(id)
        } else {
            return res.status(400).json({ error: 'Invalid contact id' });
        }
        // console.log(req.params.id)
        const database = mongodb.getDb().db('cse341');

        const collection = database.collection('contacts');

        // get the contact with the given id
        // if id is a number, use contact_id to get
        // if id is a string, use _id to get
        const query = isNumber ? { "contact_id": id } : { "_id": new ObjectId(id) };
        const contact = await collection.findOne(query);
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
        let id = req.params.id;
        const isNumber = !isNaN(id);
        const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
        if (isNumber) { 
            id = parseInt(id);
            console.log('id is a number')
            console.log(id)
        } else if (isObjectId) {
            id = id;
            console.log('id is a string')
            console.log(id)
        } else {
            return res.status(400).json({ error: 'Invalid contact id' });
        }
        const updatedContact = req.body;
        
        const database = mongodb.getDb().db('cse341');

        const collection = database.collection('contacts');

        
        // update the contact with the given id
        // if id is a number, use contact_id to update
        // if id is a string, use _id to update (ObjectId)
        const query = isNumber ? { "contact_id": id } : { "_id": new ObjectId(id) };
        // check if the contact exists
        const contact = await collection
            .findOne(query);
        if (!contact) {
            return res.status(404).json({ error: 'Contact not found' });
        }
        // update the contact
        const result = await collection.updateOne(query, { $set: updatedContact });
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
        let id = req.params.id;
        // if id is a number, convert it to a number 
        
        const database = mongodb.getDb().db('cse341');

        const collection = database.collection('contacts');

        // delete the contact with the given id
        // if id is a number, use contact_id to delete
        // if id is a string, use _id to delete
        const query = isNumber ? { "contact_id": id } : { "_id": new ObjectId(id) };
        const result = await collection.deleteOne(query);
        if (result.modifiedCount === 0) {
            return res.status(400).json({ error: 'Failed to delete contact' });
        }
        res.status(200).json({ message: 'Contact deleted successfully' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

module.exports = contactController