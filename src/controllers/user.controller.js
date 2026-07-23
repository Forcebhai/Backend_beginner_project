import { response } from "express"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const registerUser = asyncHandler(async (req, res) => {
  // to register 
  // get user details from frontend 
  // then validation [ empty user name ? wrong email etc we check  ] - not empty 
  // check if user already exist --- check the unique email and user 
  // check for images  [ upload to cloud  ] and check for avatar
  // then upload them to cloudinary , avatar or coverimage 
  // create user object -- create entry in db 
  // remove password and refresh token field from response 
  // check for user creation 
  // return response


  const { fullname, username, email, password } = req.body
  console.log("email: ", email)
  console.log("body", req.body)

  if (fullname === "") {
    throw new ApiError(400, "Fullname is required")
  }
  if (username === "") {
    throw new ApiError(400, "Username is required")
  }
  if (email === "") {
    throw new ApiError(400, "Email is required")
  }
  if (password === "") {
    throw new ApiError(400, "Password is required")
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    throw new ApiError(400, "Please enter a valid email address");
  }
  if (password.length < 8) {
    throw new ApiError(400, "Password is too short");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }]
  })

  if (existedUser) {
    throw new ApiError(409, "User already exists")
  }
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath)
  const coverImage = await uploadOnCloudinary(coverImageLocalPath)

  if (!avatar) {
    throw new ApiError(400, "Error while uploading the files")
  }

  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase()
  })

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )

  if (!createdUser) {
    throw new ApiError(500, "Error while creating user")
  }

  return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered successfully")
  )

})

export { registerUser }
