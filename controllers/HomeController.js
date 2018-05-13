var category 	= require('../models/category');
var product 	= require('../models/product');

var HomeController = {
    index  : function(req, res){
	category.find().forge().fetchAll().then(function(category) {
	    product.find().forge().fetchAll().then(function(product) {
		//product = {};
		//category.toJSON().forEach(function(data, index) {
		//    product['category'] =  [data['name']]
		//});
		//console.log(product);
		res.render('frontend/index',{category : category.toJSON(), product : product.toJSON()});
	    });
	}); 
    },
    details  : function(req, res){
	var id          = req.params.id;
	product.find().where('id', id).fetch().then(function(pro) {
	    if(req.session.cartItem != undefined) {
		cartItem = req.session.cartItem;
	    }else{
		cartItem = [];
	    }
	    if (cartItem.length > 0) {
		product.find().query(function(qb){
		    //qb.sum('price');
		    qb.where('id' , 'in' , cartItem) ;
		}).fetchAll().then(function(product) {
		    var output = product.toJSON().filter(function(value){
			if(value.id == cartItem[0]){
			    return value.price;
			}
		    });
		    console.log(output);
		    //product.toJSON().forEach(function(data, index) {
		    //
		    //});
		});
		

		//product.find().forge().whereIn('id', cartItem).fetch().then(function(product) {
		//    console.log(product);
		//});
	    }
	    res.render('frontend/details',{product : pro.toJSON(), cartItem : cartItem});
	}); 
    },
    addtocart  : function(req, res){
	var id          = req.params.id;
	if(req.session.cartItem != undefined) {
	var cart_id 	= req.session.cartItem;
	}else{
	var cart_id 	= [];
	}
	cart_id.push(id);
	req.session.cartItem = cart_id;
	res.redirect('/details/'+id);
    }
}
module.exports = HomeController;