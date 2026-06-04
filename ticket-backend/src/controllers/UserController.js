const User = require("../models/UserModel")
const bcrypt =require("bcryptjs");
const jwt = require("jsonwebtoken")


const addUser = async (req , res ) => {
    try {
        const firstName = req.body.firstname ?? req.body.firstName;
        const lastName = req.body.lastname ?? req.body.lastName;
        const { email, password, role } = req.body;

        if (!firstName?.trim() || !lastName?.trim()) {
            return res.status(400).json({ msg: "First name and last name are required" });
        }


        //if user exists
        const existingUser = await User.findUserByEmail(email);
        if (existingUser) return res.status(400).json({ msg: "User already exists"});


        const allowedRoles = ["admin", "organizer", "applicant"];
        const userRole = allowedRoles.includes(role) ? role : "applicant";

        //hash
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);


        //saving user
        const newUser = await User.createUser(
            firstName.trim(),
            lastName.trim(),
            email,
            hashedPassword,
            userRole
        );
        res.json(newUser);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Server Error")
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;


        const user = await User.findUserByEmail(email);
        if(!user) return res.status(400).json({ msg: "Invalid Credentials"});

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({ msg: "Invalid Credentials"});


        //generate token
        const token = jwt.sign(
            { id: user.id, firstname: user.firstname, lastname: user.lastname, email: user.email, role: user.role},
            process.env.JWT_SECRET,
            { expiresIn: "1h"}
        );

        res.json({
      token,
      user: {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
      },
    });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).send("Server Error");
    }
}

const getMe = async (req, res) => {
    try {
        res.json({ user: req.user });
    } catch (error) {
        res.status(500).json({ msg: "Server Error"});
    }
}

const updateUser = async (req, res) => {
    try {
        const firstName = req.body.firstname ?? req.body.firstName;
        const lastName = req.body.lastname ?? req.body.lastName;
        const { email } = req.body;
        const userId = req.user.id;

        const existingUser = await User.findUserByEmail(email);
        if (existingUser && existingUser.id !== userId){
            return res.status(400).json({msg: "Email already taken"});
        }


        const updatedUser = await User.updateUser(userId, {
            firstName: firstName?.trim(),
            lastName: lastName?.trim(),
            email,
        });

        res.json({msg: "Profile Updated Successfully!", user: updatedUser});
    } catch (error) {
        console.error("Update error:", error);
        res.status(500).json({msg: "Server Error"});
    }
};

module.exports = { addUser, loginUser, getMe, updateUser}