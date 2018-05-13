var UserModel = {
    find  : function(request, response){
        return global.bookshelf.Model.extend({
            tableName: 'users'
        });
    }
}
module.exports = UserModel;