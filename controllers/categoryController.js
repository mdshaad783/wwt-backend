import asyncHandler from "../middlewares/asyncHandler.js";
import Category from "../models/categoryModel.js";


const createCategory = asyncHandler(async(req,res)=>{
    try {
        const {name} = req.body
        if(!name){
            return res.json({error:"Name is Required..."})
        }
        const existingCategory = await Category.findOne({name})
        if (existingCategory){
            return res.json({error: "Already exists..."})
        }
        const category = await new Category({name}).save()
        res.json(category)

    } catch (error) {
        console.log(error)
        return res.status(400).json(error)
    }
})
const updateCategory = asyncHandler(async(req,res)=>{
    try {
        const {name} = req.body
        const {categoryId} = req.params
        const category = await Category.findOne({_id:categoryId})
        if(!category){
            return res.status(404).json({error:"Category not found..."})
        }

        category.name = name

        const updatedCategory = await category.save()
        res.json(updatedCategory)
    } catch (error) {
        console.error(error)
        res.status(500).json({error:"Internal Server Error..."})
    }
})

const removeCategory = asyncHandler(async(req,res)=>{
    try {
        const removed = await Category.findByIdAndDelete(req.params.categoryId)
        res.json(removed)
    } catch (error) {
        console.error(error)
        return res.status(500).json({Error:"Server Error..."})
    }
})

const listCategory = asyncHandler(async(req,res)=>{
    try {
        const all = await Category.find({})
        res.json(all)
    } catch (error) {
        console.error(error)
        return res.status(400).json(error.message)
    }
})

const readCategory = asyncHandler(async(req,res)=>{
    try {
        const category = await Category.findOne({_id:req.params.id})
        res.json(category)
    } catch (error) {
        console.log(error)
        return res.status(400).json(error.message)
    }
})
export {createCategory,updateCategory,removeCategory,listCategory,readCategory}