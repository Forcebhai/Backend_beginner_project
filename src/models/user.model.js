import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"

const userSchema = new Schema({

  id: {
    type: String,
    required: true,

  },
  watchHistory: [
    {
      type: Schema.Types.ObjectId,
      ref: "Video"
    }

  ],
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  fullname: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  avatar: {
    type: string, // cloudnary url images
    required: true
  },
  coverImage: {
    type: String, // cloudnary url images
    required: true
  },
  password: {
    type: String,
    required: [true, "password is required"]
  },
  refreshToken: {
    type: String,
    required: [true, 'Refresh token is required'],
  }
}, { timestamps: true })

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next() // this field show that if password is not modified then donot change or bcrypt password !
  }
  this.password = bcrypt.hash(this.password, 10)
  next()
})

//coustom methods 

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password)
}

userSchema.method.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullname: this.fullname
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
  )
}

userSchema.method.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
  )
}

export const User = mongoose.model("User", userSchema)