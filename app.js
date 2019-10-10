var express = require("express");
var app = express();    
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var sanitizer = require("express-sanitizer");
var methodOverride = require("method-override");

mongoose.connect("mongodb://localhost/blog_app",{useNewUrlParser: true})

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(sanitizer());

var blogSchema = mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default:Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

/*
Blog.create({
    title: "Bohemian Rhapsody",
    image: "https://farm5.staticflickr.com/4818/45831252601_29eee00be8.jpg",
    body: "Open your eyes Look up to the skies and see I'm just a poor boy, I need no sympathy Because I'm easy come, easy go A little high, little low Anyway the wind blows, doesn't really matter to me, to me"
}, (err, blog)=>{
    if (err) {
        console.log(err);
        
    } else {
        console.log(blog);
        
    }
});
*/

app.get('/', (req, res) => {
    Blog.find({}, (err, allBlogs)=>{
        if (err) {
            console.log(err);
            
        } else {    
            res.render("index", {blogs: allBlogs});     
        }
    });   
});

app.get('/blogs', (req, res) => {
    Blog.find({}, (err, allBlogs)=>{
        if (err) {
            console.log(err);
            
        } else {    
            res.render("index", {blogs: allBlogs});     
        }
    });
});

app.get('/blogs/new', (req, res) => {
    res.render("new");
});

app.get('/blogs/:id', (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog)=>{
        if (err) {
            console.log(err);
            
        } else {
            res.render("show", {blog : foundBlog});    
        }
    });
});
app.get('/blogs/:id/edit', (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog)=>{
        if (err) {
            console.log(err);
            
        } else {
            res.render("edit", {blog : foundBlog});    
        }
    });
});

app.post('/blogs', (req, res) => {

    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, (err, blogCreated)=>{
        if (err) {
            res.render("new");
            
        } else {
            res.redirect("/blogs");
        }
    });
});

app.put('/blogs/:id', (req, res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog,(err,updatedBlog)=>{
        if (err) {
            console.log(err);
            
        } else {
            res.redirect("/blogs/"+req.params.id);
        }
    });
});
app.delete('/blogs/:id', (req, res) => {
    Blog.findByIdAndDelete(req.params.id, (err,deletedBlog)=>{
        if (err) {
            console.log(err);
            
        } else {
            res.redirect("/blogs");
        }
    });
});

app.listen(3000, () => {
    console.log('App listening on port 3000!');
});