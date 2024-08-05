import moduleSchema from "../model/moduleSchema.js";

// Create a new module

const createModule = async (req, res) => {
  try {
    const { moduleName, moduleNumber } = req.body;

    const module = new moduleSchema({ moduleName, moduleNumber });
    await module.save();
    console.log(module, "aaaaaaaaaaaaa");

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
  const { moduleName } = req.params;
  const { newName, moduleNumber } = req.body;

  try {
    const module = await moduleSchema.findOneAndUpdate(
      { moduleName },
      { moduleName: newName, moduleNumber },
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
  try {
    const { moduleName } = req.params;

    const module = await moduleSchema.findOneAndDelete({ moduleName });
    f;

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
