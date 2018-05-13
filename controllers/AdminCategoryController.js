var category 	= require('../models/category');
var path        = require('path');
var fs 	        = require('fs');
var Jimp        = require("jimp");

var AdminCategoryController = {
    index  : function(req, res){
	category.find().forge().fetchAll().then(function(category) {
	    console.log(JSON.stringify(category));
            errors = req.session.errors;
            success = req.session.success;
	    user_details = req.session.user_details;
	    
	    if (typeof user_details != 'object') {
		res.redirect('/admin');
		return false;
	    }else if (user_details == null) {
		res.redirect('/admin');
		return false;
	    }
	    var breadcrumb    = {};
	    breadcrumb['title'] = 'Category';
	
	    breadcrumb['right'] =
	    [{
		'title': 'Home',
		'href' : '/admin/dashboard'
	    },
	    {
		'title': 'Category list'
	    }
	    ];
	
            req.session.errors = null;
            req.session.success = null;
            res.render('admin/category/index', {
                categories : category.toJSON(), // An array of User objects
                errors : errors,
                success : success,
		breadcrumb : breadcrumb,
		originalUrl : req.originalUrl
            });
        }).catch(function(err) {
            console.error(err);
        });   
    },
    create  : function(req, res){
            errors = req.session.errors;
            success = req.session.success;
	    user_details = req.session.user_details;
	    
	    if (typeof user_details != 'object') {
		res.redirect('/admin');
		return false;
	    }else if (user_details == null) {
		res.redirect('/admin');
		return false;
	    }
	    var breadcrumb    = {};
	    breadcrumb['title'] = 'Category';
	
	    breadcrumb['right'] =
	    [{
		'title': 'Home',
		'href' : '/admin/dashboard'
	    },
	    {
		'title': 'Category',
		'href' : '/admin/category/list'
	    },
	    {
		'title': 'Create'
	    }
	    ];
	
            req.session.errors = null;
            req.session.success = null;
            res.render('admin/category/create', {
                errors : errors,
                success : success,
		breadcrumb : breadcrumb,
		originalUrl : req.originalUrl
            });  
    },
    create_post  : function(req, res, nexts){
	req.checkBody('name', 'Name is required').notEmpty().custom( value => {
            return new Promise((resolve, reject) => {
                return category.find().where('name', value).fetch().then(function(cat) {
                    if(cat === null) {
			return resolve(true);
                    } else {
                       return reject(cat.get('name'));
                    }
                 });
            });
	}).withMessage('Name already exists');
	
        req.checkBody('description', 'Description is required').notEmpty();
        req.checkBody('status', 'Status is required').notEmpty();
     
        req.asyncValidationErrors().then(() => {            
            var data = {  
                name: req.body.name,
                description: req.body.description,
                status: req.body.status
            }
            if (typeof req.file == 'object') {
                data.image = req.file.filename;
                
                Jimp.read('./public/uploads/'+req.file.filename, function (err, lenna) {
                    if (err) throw err;
                    lenna.resize(256, 256).write('./public/uploads/thumb/'+req.file.filename); // save 
                });
            }
            category.find().forge().save(data).then(function(u) {});
            
            req.session.errors = '';
            req.session.success = 'Category Created successfully!';
            res.redirect('/admin/category/list');
        }, errors => {
            req.session.errors = errors;
            req.session.success = '';
            res.redirect('/admin/category/create');
            // validation failed
        });  
    },
    update  : function(req, res){
	var id          = req.params.id;
	category.find().where('id', id).fetch().then(function(category) {
            errors = req.session.errors;
            success = req.session.success;
	    user_details = req.session.user_details;
	    
	    if (typeof user_details != 'object') {
		res.redirect('/admin');
		return false;
	    }else if (user_details == null) {
		res.redirect('/admin');
		return false;
	    }
	    var breadcrumb    = {};
	    breadcrumb['title'] = 'Category';
	
	    breadcrumb['right'] =
	    [{
		'title': 'Home',
		'href' : '/admin/dashboard'
	    },
	    {
		'title': 'Category',
		'href' : '/admin/category/list'
	    },
	    {
		'title': 'Update'
	    }
	    ];
	
            req.session.errors = null;
            req.session.success = null;
            res.render('admin/category/update', {
                categories : category.toJSON(), // An array of User objects
                errors : errors,
                success : success,
		breadcrumb : breadcrumb,
		originalUrl : req.originalUrl
            });
        }).catch(function(err) {
            console.error(err);
        });   
    },
    update_post : function(req, res, nexts){
        var id     = req.params.id;
        req.checkBody('name', 'Name is required').notEmpty()
        .custom( value => {
            return new Promise((resolve, reject) => {
                return category.find().where('name', value).where('id', '!=', id).fetch().then(function(cat) {
                    if(cat !== null) {
                       return reject(cat.get('name'));
                    } else {
                       return resolve(true);
                    }
                 });
            });
	}).withMessage('Name already exists');
        req.checkBody('description', 'Description is required').notEmpty();
        req.checkBody('status', 'Status is required').notEmpty();
        req.asyncValidationErrors().then(() => {            
            var data = {  
                name: req.body.name,
                description: req.body.description,
                status: req.body.status
            }
            if (typeof req.file == 'object') {
                data.image = req.file.filename;
                
                Jimp.read('./public/uploads/'+req.file.filename, function (err, lenna) {
                    if (err) throw err;
                    lenna.resize(256, 256).write('./public/uploads/thumb/'+req.file.filename); // save 
                });
            }
            category.find().forge({id: id}).fetch({require: true})
                .then(function (user) {
                if (typeof req.file == 'object') {
                    if (fs.existsSync('./public/uploads/'+user.get('image')) && user.get('image') != '') {
                        fs.unlink('./public/uploads/'+user.get('image'));
			return true;
                    }
                    if (fs.existsSync('./public/uploads/thumb/'+user.get('image')) && user.get('image') != '') {
                        fs.unlink('./public/uploads/thumb/'+user.get('image'));
			return true;
                    }
                }
                user.save(data)
            });
            
            req.session.errors = '';
            req.session.success = 'Category updated successfully!';
            res.redirect('/admin/category/list');
        }, errors => {
            req.session.errors = errors;
            req.session.success = '';
            res.redirect('/admin/category/update/'+ id);
            // validation failed
        });
        
    }
}   
module.exports = AdminCategoryController;