const Product=require("../models/productSchema.js");

const createproduct=async(req,res)=>{
    try {
        const {name,description,price,category,stock,image}=req.body
        if(!name || !description || !price || !category){
            return res.status(400).json({message:"All fields are required"})
        }
        const newProduct =await Product.create({
            name,
            description,
            price,
            category,
            stock,
            image
        });
        return res.status(201).json({message:"product created successfully",product:newProduct})

    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}

const getAllProducts=async(req,res)=>{
try {
    const product=await Product.find()
    res.status(200).json(product)
} catch (error) {
    res.status(500).json({message:error.message})
}
}

const getProductById=async(req,res)=>{
    try {
        const product=await Product.findById(req.params.id)
        if(!product){
            res.status(400).json({message:"product not found"})
        }
        res.status(200).json(product)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

const updateProducts=async(req,res)=>{
    try {
        const updateProducts=await Product.findByIdAndUpdate(req.params.id,req.body,{new:true})
        console.log(updateProducts);
        if(!updateProducts){
            res.status(400).json({message:"product is not update"})
        }
        res.status(200).json({message:"updated successfully",product:updateProducts})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

const deleteProducts=async(req,res)=>{
    try {
        const deleteProducts=await Product.findByIdAndDelete(req.params.id)
        if(!deleteProducts){
            res.status(400).json({message:"product is not deleted"})
        }
        res.status(200).json({message:"product deleted"})
        
    } catch (error) {
        res.status(500).json({message:error.message})
    }

}
module.exports={createproduct,getAllProducts,getProductById,updateProducts,deleteProducts}