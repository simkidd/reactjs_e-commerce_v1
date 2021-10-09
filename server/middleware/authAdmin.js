import User from '../models/user';

const authAdmin = async (req, res, next) => {
    try {
        //  Get user info by id
        const user = await User.findOne({
            _id: req.user.id
        })
        if (user.role === 0)
            return res.status(400).json({ msg: "Admin resources access denied" })

        next()
    } catch (err) {
        return res.status(500).json({ msg: err.message })
    }
}

export default authAdmin