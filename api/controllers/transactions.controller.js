var db = require("../../db");


module.exports.index = function(req, res, next){
    // res.render('products/index', {
    //     products: db.get('products').value().slice(start, end),
    //     page: db.get('products').value()
    // });
    var transactions = db.get('transactions').value();
    res.json(transactions);
}