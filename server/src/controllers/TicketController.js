const {ticket} = require('../models')

module.exports = {
    // indx with serach Ticket
    async index (req, res) {
        try {
            let tickets = null
            const search = req.query.search
            // console.log('search key: ' + search)
            if (search) {
                tickets = await Ticket.findAll({
                    where: {
                        $or: [
                            'title', 'content', 'category'
                        ].map(key => ({
                            [key]: {
                                $like: `%${search}%`,
                            }
                        })),
                    },
                    order: [['createdAt', 'DESC']]
                })
            } else {
                tickets = await Ticket.findAll({
                    order: [['createdAt', 'DESC']]
                })
            }
                res.send(Tickets)
            } catch (err) {
            res.status(500).send({
                error: 'an error has occured trying to fetch the Tickets'
            })
        }
    },
    // create Ticket
    async create (req, res) {
        // res.send(JSON.stringify(req.body))
        try {
            const ticket = await Ticket.create(req.body)
            res.send(ticket.toJSON())
        } catch (err) {
            res.status(500).send({
                error: 'Create Ticket incorrect'
            })
        }
    },
    // edit Ticket, suspend, active
    async put (req, res) {
        try {
            await Ticket.update(req.body, {
                where: {
                    id: req.params.TicketId
                }
            })
        res.send(req.body)
        } catch (err) {
            req.status(500).send({
                error: 'Update Ticket incorrect'
            })
        }
    },
        // delete Ticket
    async remove (req, res) {
        try {
            const ticket = await Ticket.findOne({
                where: {
                id: req.params.ticketId
                }
            })
            if(!ticket){
                return res.status(403).send({
                    error: 'The Ticket information was incorrect'
                })
            }
            await ticket.destroy()
            res.send(ticket)
        } catch (err) {
            req.status(500).send({
                error: 'The Ticket information was incorrect'
            })
        }
    },
        // get Ticket by id
    async show (req, res) {
        try {
            const ticket = await Ticket.findById(req.params.TicketId)
            res.send(ticket)
        } catch (err) {
            req.status(500).send({
                error: 'The Ticket information was incorrect'
            })
        }
    },
    async frontIndex (req, res) {
        try {
            let tickets = null
            const search = req.query.search
            console.log('----------> search key: ' + search)
            if (search) {
                tickets = await Ticket.findAll({
                    where: {
                        $or: [
                            'title', 'content', 'category'
                        ].map(key => ({
                            [key]: {
                                $like: `%${search}%`,
                            }
                        })),
                        $and: [
                            {
                                status:
                                {
                                    $eq: "published"
                                }
                            },
                        ]
                    },
                    order: [['createdAt', 'DESC']]
                })
            } else {
                tickets = await ticket.findAll({
                where: {
                    'status': 'published'
                },
                    order: [['createdAt', 'DESC']]
                })
            }
            res.send(tickets)
        }catch (err) {
            res.status(500).send({
                error: 'an error has occured trying to fetch the tickets'
            })
        }
    },

}