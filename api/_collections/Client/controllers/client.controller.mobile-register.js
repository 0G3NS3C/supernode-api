module.exports = async ({ req, res, next }) => {
    let payload = req.body.payload || null;
    let password = req.body.password || null;
    let nickname = req.body.nickname || null;

	//**********************
	// Check du nickname
	//**********************
    if (nickname) {
        nickname = nickname.trim();
        if (node.services.utils.validateNickname(nickname)) {
            if (nickname.length <= 30) {
               let nicknameExist = await node.collections.user.manager.findByNickname(nickname);
               if (nicknameExist) {
                   req.response.add_error('nickname', req.print('_registration.nickname_exist'));
               }
            } else {
                nickname = null;
                req.response.add_error('nickname', req.print('_registration.nickname_toolong'));
            }
        } else {
            nickname = null;
            req.response.add_error('nickname', req.print('_registration.nickname_invalid'));
        }
    } else {
        req.response.add_error('nickname', req.print('_registration.nickname_missing'));
    }
		//**********************
    // Check du mot de passe
		//**********************
    if (password) {

    } else {
        req.response.add_error('password', req.print('_registration.password_missing'));
    }

		if (!nickname || !password || !payload) return req.respond(false);
		payload = node.services.transit.DECODE(payload);
		if (!payload) return req.respond(false);

	//**********************
	// Code et re-création Payload
	//**********************

    const code = node.services.utils.generateCodeRegister(6);
    //[A-FAIRE] Envoyer le code par mail ici
    console.log(code);
    let {iat,exp,...newPayload} = {...payload, nickname, password, code };
    newPayload = node.services.transit.ENCODE(newPayload);

    req.respond({ payload : newPayload });


}
