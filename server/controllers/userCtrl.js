import User from "../models/user";
import Payment from '../models/payment';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userCtrl = {
    register: async (req, res) => {
        try {
            const { name, email, password } = req.body;

            const user = await User.findOne({ email });
            if (user) return res.status(400).json({ msg: "Email already exists" });

            if (password.length < 6)
                return res.status(400).json({ msg: "Password must be at least 6 characters long." });

            // Password encryption
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(password, salt);

            const newUser = new User({
                name,
                email,
                password: passwordHash,
            });

            // save to mongodb
            await newUser.save();

            // jsonwebtoken for authenication
            const accesstoken = createAccessToken({ id: newUser._id });
            const refreshtoken = createRefreshToken({ id: newUser._id });

            res.cookie("refreshtoken", refreshtoken, {
                httpOnly: true,
                path: "/user/refresh_token",
                maxAge: 7*24*60*60*1000   // 7days
            });

            res.json({ accesstoken });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ email });
            if (!user) return res.status(400).json({ msg: "User does not exist." });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ msg: "Incorrect password," });

            // If login success, create access token and refresh token
            const accesstoken = createAccessToken({ id: user._id });
            const refreshtoken = createRefreshToken({ id: user._id });

            res.cookie("refreshtoken", refreshtoken, {
                httpOnly: true,
                path: "/user/refresh_token",
                maxAge: 7*24*60*60*1000   // 7days
            });

            res.json({ accesstoken });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    logout: async (req, res) => {
        try {
            res.clearCookie('refreshtoken', { path: '/user/refresh_token' })
            return res.json({ msg: "Logged out!" })
        } catch (err) {
            res.status(500).json({ msg: err.message })
        }
    },
    refreshToken: (req, res) => {
        try {
            const rf_token = req.cookies.refreshtoken;
            if (!rf_token)
                return res.status(400).json({ msg: "Please Login or Register" });

            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if (err)
                    return res.status(400).json({ msg: "Please Login or Register" });

                const accesstoken = createAccessToken({ id: user.id });

                res.json({ accesstoken });
            });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    getUser: async (req, res) => {
        try {
            const user = await User.findById(req.user.id).select('-password')
            if(!user) return res.status(400).json({msg: "User does not exist."})

            res.json(user)
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    addCart: async(req,res)=>{
        try{
            const user = await User.findById(req.user.id)
            if(!user) return res.status(400).json({msg: "User does not exist"})

            await User.findOneAndUpdate({_id: req.user.id}, {
                cart: req.body.cart
            })
            
            return res.json({msg: "Added to cart"})
        }catch(err){
            return res.status(500).json({msg: err.message})
        }
    },
    history: async(req,res)=>{
        try {
            const history = await Payment.find({user_id: req.user.id})

            res.json(history)
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
};

const createAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "11m" });
};
const createRefreshToken = (user) => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

export default userCtrl;
