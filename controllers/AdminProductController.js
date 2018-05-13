var product 	= require('../models/product');
var category 	= require('../models/category');
var path        = require('path');
var fs 	        = require('fs');
var Jimp        = require("jimp");

var AdminProductController = {
    index  : function(req, res){
	product.find().forge().fetchAll({withRelated: ['category']}).then(function(product) {
	    
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
	    breadcrumb['title'] = 'Product';
	
	    breadcrumb['right'] =
	    [{
		'title': 'Home',
		'href' : '/admin/dashboard'
	    },
	    {
		'title': 'Product list'
	    }
	    ];
	
            req.session.errors = null;
            req.session.success = null;
            res.render('admin/product/index', {
                categories : product.toJSON(), // An array of User objects
                errors : errors,
                success : success,
		breadcrumb : breadcrumb
            });
        }).catch(function(err) {
            console.error(err);
        });   
    },
    create  : function(req, res){
	
            category.find().forge().fetchAll().then(function(category) {
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
		breadcrumb['title'] = 'Product';
	    
		breadcrumb['right'] =
		[{
		    'title': 'Home',
		    'href' : '/admin/dashboard'
		},
		{
		    'title': 'Product',
		    'href' : '/admin/product/list'
		},
		{
		    'title': 'Create'
		}
		];
	    
		req.session.errors = null;
		req.session.success = null;
		res.render('admin/product/create', {
		    errors : errors,
		    success : success,
		    breadcrumb : breadcrumb,
		    category : category.toJSON()
		});
	    });
    },
    create_post  : function(req, res, nexts){
	req.checkBody('name', 'Name is required').notEmpty().custom( value => {
            return new Promise((resolve, reject) => {
                return product.find().where('name', value).fetch().then(function(cat) {
                    if(cat === null) {
			return resolve(true);
                    } else {
                       return reject(cat.get('name'));
                    }
                 });
            });
	}).withMessage('Name already exists');
	
        req.checkBody('quantity', 'Quantity is required').notEmpty();
	req.checkBody('price', 'Price is required').notEmpty();
        req.checkBody('status', 'Status is required').notEmpty();
     
        req.asyncValidationErrors().then(() => {            
            var data = {
		category_id : req.body.category,
                name: req.body.name,
                quantity: req.body.quantity,
		price: req.body.price,
                status: req.body.status
            }
            if (typeof req.file == 'object') {
                data.image = req.file.filename;
                
                Jimp.read('./public/uploads/'+req.file.filename, function (err, lenna) {
                    if (err) throw err;
                    lenna.resize(256, 256).write('./public/uploads/thumb/'+req.file.filename); // save 
                });
            }
            product.find().forge().save(data).then(function(u) {});
            
            req.session.errors = '';
            req.session.success = 'Product Created successfully!';
            res.redirect('/admin/product/list');
        }, errors => {
            req.session.errors = errors;
            req.session.success = '';
            res.redirect('/admin/product/create');
            // validation failed
        });  
    },
    update  : function(req, res){
	var id          = req.params.id;
	product.find().where('id', id).fetch().then(function(product) {
	    category.find().forge().fetchAll().then(function(category) {
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
		breadcrumb['title'] = 'Product';
	    
		breadcrumb['right'] =
		[{
		    'title': 'Home',
		    'href' : '/admin/dashboard'
		},
		{
		    'title': 'Product',
		    'href' : '/admin/product/list'
		},
		{
		    'title': 'Update'
		}
		];
	    
		req.session.errors = null;
		req.session.success = null;
		res.render('admin/product/update', {
		    categories : product.toJSON(), // An array of User objects
		    errors : errors,
		    success : success,
		    breadcrumb : breadcrumb,
		    category : category.toJSON()
		});
	    }).catch(function(err) {
		console.error(err);
	    });
	});
    },
    update_post : function(req, res, nexts){
        var id     = req.params.id;
        req.checkBody('name', 'Name is required').notEmpty()
        .custom( value => {
            return new Promise((resolve, reject) => {
                return product.find().where('name', value).where('id', '!=', id).fetch().then(function(cat) {
                    if(cat !== null) {
                       return reject(cat.get('name'));
                    } else {
                       return resolve(true);
                    }
                 });
            });
	}).withMessage('Name already exists');
        req.checkBody('quantity', 'Quantity is required').notEmpty();
	req.checkBody('price', 'Price is required').notEmpty();
        req.checkBody('status', 'Status is required').notEmpty();
        req.asyncValidationErrors().then(() => {            
            var data = {
		category_id : req.body.category,
                name: req.body.name,
                quantity: req.body.quantity,
		price: req.body.price,
                status: req.body.status
            }
            if (typeof req.file == 'object') {
                data.image = req.file.filename;
                
                Jimp.read('./public/uploads/'+req.file.filename, function (err, lenna) {
                    if (err) throw err;
                    lenna.resize(256, 256).write('./public/uploads/thumb/'+req.file.filename); // save 
                });
            }
            product.find().forge({id: id}).fetch({require: true})
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
            req.session.success = 'Product updated successfully!';
            res.redirect('/admin/product/list');
        }, errors => {
            req.session.errors = errors;
            req.session.success = '';
            res.redirect('/admin/product/update/'+ id);
            // validation failed
        });
        
    }
}   
module.exports = AdminProductController;