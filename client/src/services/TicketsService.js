import Api from '@/services/Api'
export default {
    index(search) {
        return Api().get('Tickets', {
            params: {
                search: search
            }
        })
    },
    show(ticketId) {
        return Api().get('ticket/' + ticketId)
    },
    post(ticket) {
        return Api().post('ticket', ticket)
    },
    put(ticket) {
        return Api().put('ticket/' + ticket.id, ticket)
    },
    delete(ticket) {
        return Api().delete('ticket/' + ticket.id, ticket)
    },
    frontIndex(search) {
        return Api().get('tickets/front', {
            params: {
                search: search
            }
        })
    },
}