import moduleSchema from "../model/moduleModel.js";

// Create a new module

const createModule = async (req, res, next) => {
  // Check if the users have permission to access this operation
  console.log(req.user.role);
  if (!req.user?.permissions.includes("CRUD")) {
    return res.status(403).send({ message: "You do not have access." });
  }

  try {
    const { moduleName, moduleId } = req.body;

    const module = new moduleSchema({ moduleName, moduleId });
    await module.save();

    if (!module) res.status(404).send({ message: "Module not found" });

    res.status(200).send({
      success: true,
      message: `You created module: ${module.moduleName}`,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while creating module.",
      error: error.message,
    });
  }
};

// get all modules

const getAllModules = async (req, res) => {
  // Check if the users have permission to access this operation
  if (!rqe.user.permissions.includes("CRUD")) {
    return res.status(403).send({ message: "You do not have access." });
  }

  try {
    const modules = await moduleSchema.find({});

    if (!modules) res.status(404).send({ message: "No modules found" });

    res.status(200).send(modules);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while getting all modules.",
      error: error.message,
    });
  }
};

// get single module

const getSingleModule = async (req, res) => {
  // Check if the users have permission to access this operation
  if (!rqe.user.permissions.includes("CRUD")) {
    return res.status(403).send({ message: "You do not have access." });
  }

  try {
    const { moduleName } = req.params;

    const module = await moduleSchema.findOne({ moduleName });

    if (!module) res.status(404).send({ message: "Module not found" });

    res
      .status(200)
      .send({ message: `You found a module: ${module.moduleName}`, module });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while getting single module.",
      error: error.message,
    });
  }
};

// update module

const updateModule = async (req, res) => {
  // Check if the users have permission to access this operation
  if (!rqe.user.permissions.includes("CRUD")) {
    return res.status(403).send({ message: "You do not have access." });
  }

  const { moduleName } = req.params;
  const { newName, newId } = req.body;

  try {
    const module = await moduleSchema.findOneAndUpdate(
      { moduleName },
      { moduleName: newName, moduleId: newId },
      { new: true, runValidators: true }
    );

    if (!module) {
      return res.status(404).send({
        success: false,
        message: "Module not found.",
      });
    }

    res.status(200).send({
      success: true,
      message: "Module updated successfully",
      module,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "An error occurred while updating the module",
      error: error.message,
    });
  }
};

// delete module

const deleteModule = async (req, res) => {
  // Check if the users have permission to access this operation
  if (!rqe.user.permissions.includes("CRUD")) {
    return res.status(403).send({ message: "You do not have access." });
  }

  try {
    const { moduleName } = req.params;

    const module = await moduleSchema.findOneAndDelete({ moduleName });

    if (!module) res.status(404).send({ message: "Module not found" });

    res.status(200).send({
      success: true,
      message: "Module deleted successfully",
      module,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while deleting module.",
      error: error.message,
    });
  }
};

export {
  createModule,
  getAllModules,
  getSingleModule,
  updateModule,
  deleteModule,
};
