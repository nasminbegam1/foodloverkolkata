var loginCheck = {
    checking : function(req, res){
        var user_details = req.session.user_details;
        console.log(user_details);
    }
}

module.exports = loginCheck;