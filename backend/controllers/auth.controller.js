const authService = require('../services/auth.services');

exports.login = async (req, res) => {
    try {
        const result = await authService.login(req.body);
        result.success = true;
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
}

exports.register = async (req, res) => {
    try {
        const result = await authService.register(req.body);
        result.success = true;
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
}