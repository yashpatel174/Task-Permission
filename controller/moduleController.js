import moduleModel from "../model/moduleModel.js"




// Create a new module

const createModule = async (req, res) => {

    // Check if the users have permission to access this operation
    if (!rqe.user.permissions.includes('CRUD')) {
        return res.status(403.).send({ message: "You do not have access."})
    }

    try {

    const { moduleName, moduleId} = req.body;
        
    const module = new moduleModel({moduleName, moduleId});
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

    // Check if the users have permission to access this operation
    if (!rqe.user.permissions.includes('CRUD')) {
        return res.status(403.).send({ message: "You do not have access."})
    }

    try {
    
        const modules = await moduleModel.find({});

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

    // Check if the users have permission to access this operation
    if (!rqe.user.permissions.includes('CRUD')) {
        return res.status(403.).send({ message: "You do not have access."})
    }

    try {

    const {name} = req.params;
        
    const module = moduleSchema.findOne({name});

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

    // Check if the users have permission to access this operation
    if (!rqe.user.permissions.includes('CRUD')) {
        return res.status(403.).send({ message: "You do not have access."})
    }

    try {
        
        const { name } = req.params;

        const {moduleName, moduleId} = req.body;

        const module = await moduleModel.findOneAndUpdate(name, {moduleName, moduleId}, {new: true});

        if (!module) return res.status(403).send({message: "Not able to find module."})

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

    // Check if the users have permission to access this operation
    if (!rqe.user.permissions.includes('CRUD')) {
        return res.status(403.).send({ message: "You do not have access."})
    }

    
    try {
        
        const {name} = req.params;

        const module = await moduleModel.findOneAndDelete(name);

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