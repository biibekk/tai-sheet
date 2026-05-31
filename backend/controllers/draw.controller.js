const drawServices = require("../services/draw.services");

exports.generateDraw = async (req, res) => {
    try {
        const result =
            await drawServices.generateDraw(
                req.params.categoryId
            );
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};