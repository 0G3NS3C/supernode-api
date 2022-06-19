module.exports = async ({ req, res, next }) => {
        console.log('check number');


        let number = req.body.number;
        if (number) {

            if (!number.trim().length) number = null;
            if (number && !node.services.utils.validateNumber('fr', number)) number = null;
            if (!number) {
                req.response.add_error('api', req.print('_registration.invalid_phone_number'));
                return req.respond(false);
            }
            let payload = node.services.transit.ENCODE({ number });
            let numberExist = await node.collections.user.manager.findByNumber(number);
            if (numberExist) {
                return req.respond({exist: true, number: number, payload });
            } 
            else return req.respond({exist: false, number: number, payload})
        }
        else {
            req.response.add_error('api','invalid number');
            return req.respond(false);
        }
}
