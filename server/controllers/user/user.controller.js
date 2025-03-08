import jwt from "jsonwebtoken"
import bcryptjs from "bcryptjs"
import {config} from "dotenv"
import {PrismaClient} from "@prisma/client"

config()
const prisma = new PrismaClient({})

export const RegisteruserController = async(req, res) => {
    const {name, email, password} = req.body
    try {
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }
        const hashedPassword = await bcryptjs.hash(password, 10)
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        })

        const token = jwt.sign(user.id, process.env.JWT_KEY)
        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user,
            authToken: token
        })
        
    } catch (error) {
        returnres.status(500).json({
            success: false,
            message: "Server error while creating user",
        })
    }
}

export const LoginUserController = async(req, res) => {
    const {email, password} = req.body
    try {
        const user = await prisma.user.findFirst({
            where:{
                email
            }
        })

        if (!user) {
            return res.status(404).json({
                success: false,
                message: `User not found with this ${email} email address`
            })
        }
        const isPasswordCorrect = await bcryptjs.compare(password, user.password)
        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Invalid password"
            })
        }
        
        const token = jwt.sign(user.id, process.env.JWT_KEY)
        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            user,
            authToken: token
        })
    
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error while logging in user",
        })
        
    }
}

export const ForgotPasswordController = async(req, res) => {
     const {email, password} = req.body
     try {
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }
        const existedUser = await prisma.user.findFirst({
            where:{
                email
            }
        })
        if (!existedUser) {
            return res.status(404).json({
                success: false,
                message: `User not found with this ${email} email address`
            })
        }
        const hashedPassword = await bcryptjs.hash(password, 10)
        const user = await prisma.user.update({
            where:{
                email
            },
            data: {
                password: hashedPassword
            }
        })
        return res.status(200).json({
            success: true,
            message: "Password reset successfully"
        })
     } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error while resetting password"
        })
     }
}