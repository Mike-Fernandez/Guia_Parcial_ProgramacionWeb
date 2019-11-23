const Post = require("../models/Post");
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

module.exports.searchPost = (req,res,next) => {
    debug("Search User", req.params);
    Post.findOne({
        title: req.params.title
        })
        .then((foundPost) => {
            if (foundPost)
                return true
            else
                return res.status(400).json(null)
        })
        .catch(err => {
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
        }).then(post => {
            return res
                .header('Location', '/post/' + post._id)
                .status(201)
                .json({
                    username: post.title,
                    content: post.content
                });
        }).catch(err => {
            next(err);
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

