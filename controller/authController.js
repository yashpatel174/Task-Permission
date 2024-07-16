import userSchema from '../model/userModel.js';
import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken';

const register = async (req, res) => {

    const {username, password} = req.body;

    try {

        const saltRound = 10

        const hashedPassword = await bcrypt.hash(password, saltRound);
        
        const user = userSchema({username, password:hashedPassword});
        await user.save();

        if(!user) res.status(403).send({message: 'User not created.'})

            res.status(200).send({
                success: true,
                message: 'User created successfully',
                user
            })

    } catch (error) {
        
        res.status(500).send({
            success: false,
            message: 'Error while registering group.',
            error: error.message
        })

    }

}

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await userSchema.findOne({ username });

        // Check if user exists
        if (!user) {
            return res.status(400).send({
                success: false,
                message: 'Invalid username or password.',
                error: (error => error.message)
            });
        }

        // Compare password
        const comparePassword = await bcrypt.compare(password, user.password);

        if (!comparePassword) {
            return res.status(400).send({
                success: false,
                message: 'Invalid username or password.',
                error: (error => error.message)
            });
        }

        // Create token
        const token = JWT.sign(
            { name: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION }
        );

        res.status(200).send({
            success: true,
            message: 'User logged in successfully',
            token: token
        });

    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Error while logging in.',
            error: error.message
        });
    }
};

export {register, login}