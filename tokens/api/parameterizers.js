function create(req, res, next) {
  if(!('content' in req.body) || !('type' in req.body)){
   res.sendStatus(422);
  };

  if(!('maxAge' in req.body)) {
    req.body.maxAge = 0;
  }

  stringifyKeys(req.body);

  next();
};

function stringifyKeys(object) {
  for (var key in object) {
    if (object.hasOwnProperty(key) && key != 'maxAge') {
      object[key] = String(object[key]);
    }
  }
};

module.exports = {
  create: create
};