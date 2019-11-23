const Post = require("../models/Post");
const User = require("../models/Usuario");
var debug = require('debug')('blog:user_controller');

module.exports.getPost = (req,res,next) => {
    debug("Search User", req.params);
    Post.findOne({
        title: req.params.title
        })
        .then((foundPost) => {
            if (foundPost)
                return res.status(200).json(foundPost);
            else
                return res.status(400).json(null)
        })
        .catch(err => {
            next(err);
        });
}

module.exports.find = (req, res, next) => {
    var perPage = Number(req.query.size) || 10,
        page = req.query.page > 0 ? req.query.page : 0;

    debug("Post List", {
        size: perPage,
        page,
        search: req.params.search
    });
    console.log(req.params.search);

    var filter = {
        state: {
            "$ne": "draft"
        }
    }

    if (!req.listPost) {

        filter = {
            ...filter,
            "$or": [{
                    $text: {
                        $search: req.params.search
                    }
                },
                {
                    "tags": {
                        "$regex": `${req.params.search}`
                    }
                }
            ]
        }
    }

    debug("Filter With", filter);


    Post.find()
        .where(filter)
        .limit(perPage)
        .skip(perPage * page)
        .then((posts) => {
            debug("Count post", posts.length);
            return res.status(200).json(posts)
        }).catch(err => {
            next(err);
        });
}

module.exports.getAllPosts = (req,res,next) => {
    var perPage = Number(req.query.size) || 10,
        page = req.query.page > 0 ? req.query.page : 0;

    var sortProperty = req.query.sortby || "createdAt",
        sort = req.query.sort || "desc";

    debug("Post List",{size:perPage,page, sortby:sortProperty,sort});

    Post.find({})
        .limit(perPage)
        .skip(perPage * page)
        .sort({ [sortProperty]: sort})
        .then((posts) => {
           return res.status(200).json(posts)
        }).catch(err => {
            next(err);
        })
}
/*
module.exports.makePost = (req,res,next) => {
    debug("New Post", {
        body: req.body
    });
    Post.findOne({
            title: req.body.title
        })
        .then((foundUser) => {
            if (foundUser) {
                debug("Post con mismo titulo ya existe duplicado");
                throw new Error(`Post con titulo ${req.body.title} ya existe, porfavor cambie de nombre el titulo del post`);
            } else {
                User.findOne({
                    username: req.body.author
                }, "-password -login_count")
                .then((foundUser) =>{
                    if(foundUser){
                        console.log("found!!!");
                        let newPost = new Post({
                            title: req.body.title,
                            author: req.body.author,
                            commments: req.body.commments,
                            tags: req.body.tags,
                            state: req.body.state,
                            content: req.body.content
                        });
                        return newPost.save();        
                    }
                    else{
                        throw new Error(`No existe el usuario ${req.body.author}. Porfavor registre una cuenta`);
                    }
                })
            }
        }).then(post => {
            return res
                .status(201)
                .json({
                    username: post.title,
                    content: post.content
                });
        }).catch(err => {
            next(err);
        });
}*/

module.exports.makePost = (req,res,next) => {
    debug("Create Post");
    User.findOne({
            username: req.body.author
        })
        .then(user => {
            if (!user) {
                throw new Error("El autor no existe");
            } else {

                let post = new Post({
                    title: req.body.title,
                    author: user._id,
//                    comments: req.body.comments || "",
                    tags: (req.body.tags || "").split(","),
                    state: req.body.state || 'draft',
                    content: req.body.content
                });

                return post.save()
            }
        })
        .then(post => {
            return res
                .header('Location', '/post/' + post.title)
                .status(201)
                .json({
                    title: post.title,
                    _id: post._id
                });
        })
        .catch(err => {
            next(err)
        });
}

module.exports.updatePost = (req,res,next) => {
    debug("Update post", {
        title: req.params.title,
        ...req.body
    });

    let update = {
        ...req.body
    };

    Post.findOneAndUpdate({
            title: req.params.title
        }, update, {
            new: true
        })
        .then((updated) => {
            if (updated)
                return res.status(200).json(updated);
            else
                return res.status(400).json(null);
        }).catch(err => {
            next(err);
        });
}

module.exports.deletePost = (req,res,next) => {
    debug("Delete post", {
        title: req.params.title
    });

    Post.findOneAndDelete({title: req.params.title})
    .then((data) =>{
        if (data) res.status(200).json(data);
        else res.status(404).send();
    }).catch( err => {
        next(err);
    })
}

module.exports.addComment = (req,res,next) => {
    debug("Update post", {
        title: req.params.title,
        ...req.body
    });

    let comment = {
        ...req.body
    };

    Post.findOneAndUpdate({
            title: req.params.title
        }, update, {
            new: true
        })
        .then((updated) => {
            if (updated)
                return res.status(200).json(updated);
            else
                return res.status(400).json(null);
        }).catch(err => {
            next(err);
        });    
}

