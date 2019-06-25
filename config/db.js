if(process.env.NODE_ENV == "production"){
    module.exports = {mongoURI: "mongodb+srv://mongoteste:mongoteste@cluster0-ptw3s.mongodb.net/test?retryWrites=true&w=majority"}
}else{
    module.exports = {mongoURI: "mongodb://localhost/mongoblog"}
}