/**
 * Created by jonathanc on 10/9/15.
 */

var Action = function(app) {

};

Action.prototype.create_new_token = function(stuff) {
    return {token:"gibberish",
            stuff:stuff  };
};



module.exports = Action;