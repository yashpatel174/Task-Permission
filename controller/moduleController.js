import moduleModel from "../model/moduleModel.js"


// Create a new module

const createModule = async (req, res) => {

    const { moduleName, moduleId } = req.body;

    try {
    
    const module = moduleModel(moduleName, moduleId);
    module.save();

    if(!module) res.status(404).send({message: 'Module not found'});

    res.status(200).send({
        success: true,
        message: 'Module created successfully',
        module
    })
        
    } catch (error) {
    
        res.status(500).send({
            success: false,
            message: 'Error while creating module.',
            error: error.message
        })

    }

}


// get all modules

const getAllModules = async (req, res) => {

    try {
    
        const modules = await moduleModel.find();

        if(!modules) res.status(404).send({message: 'No modules found'});

        res.status(200).send(modules);

    } catch (error) {
    
        res.status(500).send({
            success: false,
            message: 'Error while getting all modules.',
            error: error.message
        })

    }

}



// get single module

const getSingleModule = (req, res) => {

    const {moduleName} = req.body;

    try {
        
    const module = moduleSchema.findOne(moduleName);

    if(!module) res.status(404).send({message: 'Module not found'});

    res.status(200).send({message: `You found a module: ${module.moduleName}`});

    } catch (error) {   
    
        res.status(500).send({
            success: false,
            message: 'Error while getting single module.',
            error: error.message
        })

    }

}



// update module

const updateModule = async (req, res) => {

    const { moduleName, moduleId } = req.body;

    try {
    
        const module = await moduleModel.findOneAndUpdate(moduleName, moduleId, {new: true});

        if(!module) res.status(404).send({message: 'Module not found'});

        res.status(200).send({
            success: true,
            message: 'Module updated successfully',
            module
        })

    } catch (error) {
    
        res.status(500).send({
            success: false,
            message: 'Error while updating module.',
            error: error.message
        })

    }

}



// delete module

const deleteModule = async (req, res) => {

    const {moduleName} = req.body;

    try {
    
        const module = await moduleModel.findOneAndDelete(moduleName);

        if(!module) res.status(404).send({message: 'Module not found'});

        res.status(200).send({
            success: true,
            message: 'Module deleted successfully',
            module,
        })

    } catch (error) {
    
        res.status(500).send({
            success: false,
            message: 'Error while deleting module.',
            error: error.message
        })

    }

}


export {createModule, getAllModules, getSingleModule, updateModule, deleteModule}