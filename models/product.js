var category 	= require('../models/category');

var ProductModel = {
    find  : function(request, response){
        return global.bookshelf.Model.extend({
            tableName: 'products',
            category: function () {
                return this.belongsTo(category.find(), 'category_id');
            }
        });
    }
}
module.exports = ProductModel;