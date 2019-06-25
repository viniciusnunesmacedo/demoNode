if(process.env.NODE_ENV == "production"){
    module.exports = {mongoURI: "mongodb+srv://mongoteste:mongoteste@cluster0-qf7xf.mongodb.net/mongoblog?retryWrites=true&w=majority"}
}else{
    module.exports = {mongoURI: "mongodb://localhost/mongoblog"}
}