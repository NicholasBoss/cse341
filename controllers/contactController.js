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
        console.log(req.params.id)
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

module.exports = contactController