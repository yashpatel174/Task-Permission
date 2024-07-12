import express from 'express'
import moduleSchema from "../model/module.js"

const router = express.Router();

const createModule = async (req, res) => {

    try {

        const {moduleName, moduleId} = req.body;

        const module  = moduleSchema({moduleName, moduleId});
        await module.save();

        if(!module) {
            res.status(404).send({
                success: false,
                message: "Failed to create module",
                error: error.message
            })
        }

        res.status(200).send({
            success: true,
            message: `Module created successfully as ${module.moduleName}`,
            module
        })

        
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Failed to create module",
            error: error.message
        })
    }

}


const getAllModules = async (req, res) => {

    try {

        const module = await moduleSchema.find();

        if(!module) res.status(404).send({message: "Modules not found."})

            res.status(200).send({
                success: true,
                message: "All modules fetched successfully",
                module
            })

    } catch (error) {
        
        res.status(500).send({
            success: false,
            message: "Failed to get all modules",
            error: error.message
        })

    }
}


const getSingleModule = async (req, res) => {

    try {

        const userName = req.params

        const module = await moduleSchema.findOne(userName)

        if(!module) res.status(404).send({message: "Module not exist, so you may create this module."})

            res.status(200).send({
                success: true,
                message: `You found the module: ${module.moduleName}`,
                module: module
            })
        
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Failed to get module",
            error: error.message
        })
    }

}


const updateModule = async (req, res, next) => {

    try {

        const {moduleName, moduleId} = req.body;
        const module = req.params;

        // checking if the serched module is exist or not

        // const existingModule = await moduleSchema.moduleName

        // if(module !== existingModule) {
        //     return (
        //         res.send({message: "Module is not exist, You may create it."})
        //     )
        // } else {
        //     next();
        // } 

        const updatedModule = await moduleSchema.findOneAndUpdate( module, { moduleName, moduleId, new: true} );

        if(!updatedModule) res.send({
            success: false,
            message: "Module not updated, please try again."
        })

            res.status(200).send({
                success: true,
                message: 'Module updated successfully.',
                updatedModule
            })
        
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Failed to update module",
            error: error.message
        })
    }

}


const deleteModule = async (req, res, e) => {

try {

    e.preventDefault();

    const {moduleName} = req.body;

    const deleteModule = await moduleSchema.findOneAndDelete(moduleName)
    if(!deleteModule) res.send({ message: "Error while deleting module."})

        res.status(200).send({
            success: true,
            message: 'Module deleted successfully.',
            deleteModule
        })

    
} catch (error) {
    res.status(500).send({
        success: false,
        message: "Failed to delete module",
        error: error.message
    })
}

}


export {createModule, getAllModules, getSingleModule, updateModule, deleteModule}