/* GET resource listing. */
exports.list = function(req, res){
  res.send([{ name: 'Basic Auth Protected Resource' }]);
};
