var express     =require("express"),
    app         =express(),
    mongoose=require("mongo--=ose"),
    bodyParser=require("body-parser"),
    methodOverride=require("method-override"),
    expressSanitizer=require("express-sanitizer");

mongoose.connect("mongodb://localhost/resful_blog_app");
app.set("view engine","ejs");
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer())
app.use(methodOverride("_method"));

//schema
var blogSchema= new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:
        {   type: Date,
            default: Date.now}
});
//mongoose model 
var blog=mongoose.model("blog",blogSchema);



/*blog.create({
    title:"Test Blog",
    image:"http://glintdemoz.com/timelylife/assets/attached_files/17_2016_06_07_11_24_05_logo_test.jpg",
    body:"This is the description for the test blog"
    
});
*/
//Restful routes
//index
app.get("/blogs",function(req,res)
{
    blog.find({},function(error,data)  //find with no arguments means that we want all the object i/e the specified collection
        {
            if(error){res.send("error occur")}
            else{res.render("index",{data:data})}
        }
            );
}
        );

app.get("/",function(req,res){
    res.redirect("/blogs")
})

// new route
app.get("/blogs/new",function(req,res) {
    res.render("new");
});
//create route
app.post("/blogs",function(req,res){
    //create blog
     console.log(req.body.blogp);
    console.log("===========================")
   req.body.blogp.body=req.sanitize(req.body.blogp.body)
     console.log(req.body.blogp);
    blog.create(req.body.blogp,function(error,data){//create a  object with that body i/e name of the element in ejs
       
       if(error){res.render("new")}
       else{
           res.redirect("/blogs"); //redirect to the index
       }
  
    })
    
})


 //show route
     app.get("/blogs/:id",function(req, res) {
        blog.findById(req.params.id,function(error,foundBlog){
            if(error){res.redirect("/blogs")}
            else{res.render("show",{blog:foundBlog})}
        })
     })

// edit route
app.get("/blogs/:id/edit",function(req,res) {
   
    blog.findById(req.params.id,function(error,foundBlog){
        if(error){res.redirect("/blogs")}
        else res.render("edit",{blog:foundBlog})
    });
   
});


//update



app.put("/blogs/:id",function(req,res){
    
blog.findByIdAndUpdate(req.params.id, req.body.blogp,function(error,updated){
    
    if(error){res.redirect("/blogs/")}
    else{res.redirect("/blogs/"+req.params.id)}
})
})

//delete route

app.delete("/blogs/:id", function(req,res){
    blog.findByIdAndRemove(req.params.id,function(error,deleted){//signifgicant woking lines behind code
        if(error){res.send("error,you may went wrong")}
        else{res.redirect("/blogs")}
    })
})

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("server is boosting")
})
    
    
    
    