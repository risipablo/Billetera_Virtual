const express = require('express')
const { protect } = require('../middleware/authMiddleware')
const router = express.Router()

router.get('/validate-token', protect, (req ,res) => {
    res.status(200).json({
        success: true,
        user :{
            id: req.user._id,
            name: req.user.name,
            email: req.user.email
        }
    })
})

module.exports = router;


// En est endpoint si todo es correcto permite al front que verifique si el usuario sigue conectado