const mongoose = require('mongoose');

const productSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"please add product name"]
    },
    description:{
        type:String,
        required:[true,"enter your product description"]
    },
    price:{
        type:Number,
        required:[true,"please enter your product price"]
    },
    category:{
        type:String,
        required:[true,"please enter your product category"]
    },
    stock:{
        type:Number,
        default:0
    },
    image:{
        type:String,
        default:"https://www.google.com/url?sa=i&url=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Fproduct&psig=AOvVaw2S2fOh0jPxtylH-jBQUYGH&ust=1761370825559000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCPCIjeWPvJADFQAAAAAdAAAAABAE"
    }
    },
   {
    timestamps:true
    }
    
)
const Product=mongoose.model("product",productSchema)
module.exports= Product;