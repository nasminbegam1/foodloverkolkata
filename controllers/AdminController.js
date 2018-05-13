var user 	= require('../models/user');
var loginCheck 	= require('../config/loginCheck');

var AdminController = {
    login  : function(req, res){
	errors = req.session.errors;
	success = req.session.success;
	req.session.errors = null;
	req.session.success = null;
        res.render('admin/login',{
                errors : errors,
                success : success
        });   
    },
    login_post : function(req, res){
	req.checkBody('email', 'Email is required').notEmpty().custom( value => {
            return new Promise((resolve, reject) => {
                return user.find().where('email', value).where('user_type', '0').fetch().then(function(cat) {
                    if(cat !== null) {
			return resolve(cat.get('email'));
                    } else {
                       return reject(true);
                    }
                 });
            });
	}).withMessage('Email address is not exists in our database');
	
        req.checkBody('password', 'Password is required').notEmpty();
	req.asyncValidationErrors().then(() => {
	    var email = req.body.email;
	    var password = req.body.password;
	    user.find().where('email', email).where('password', password).fetch().then(function(cat) {
		if(cat !== null) {
		    req.session.user_details = cat;
		    res.redirect('/admin/dashboard');
		} else {
		    req.session.errors = 'Please enter valid username and password';
		    req.session.success = '';
		    res.redirect('/admin');
		}
	     });
        }, errors => {
            req.session.errors = errors;
            req.session.success = '';
            res.redirect('/admin');
        });
    },
    dashboard  : function(req, res){
	errors = req.session.errors;
	success = req.session.success;
	user_details = req.session.user_details;
	//loginCheck.checking();
	if (typeof user_details != 'object') {
	    res.redirect('/admin');
	    return false;
	}else if (user_details == null) {
	    res.redirect('/admin');
	    return false;
	}
	req.session.errors = null;
	req.session.success = null;
	var breadcrumb    = {};
	breadcrumb['title'] = 'Dashboard';
	
	breadcrumb['right'] =
	[{
	    'title': 'Home',
	    'href' : '/admin/dashboard'
	},
	{
	    'title': 'Dashboard',
	    'href' : '#'
	}
	];
	
        res.render('admin/dashboard',{
                errors : errors,
                success : success,
		user_details : user_details,
		breadcrumb : breadcrumb,
		originalUrl : req.originalUrl
		
        });   
    },
    logout  : function(req, res){
	req.session.errors = null;
	req.session.success = null;
	req.session.user_details = null;
	res.redirect('/admin');
    },
}
module.exports = AdminController;