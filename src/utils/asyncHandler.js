const asyncHandler = (requestHandler) => {

  (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next))
      .catch((err) => next(err))
  }

}


export { asyncHandler }


//const asyncHandler =() => {}
// const asyncHandeler = (func) => () => {}
// const asyncHandeler = (func) => () => {} =>  async (req,res,next) => {}



// const asyncHandler = (fn) => async (req, res, next) => {
//   try {
//     await fn(req, res, next)
//   } catch (error) {
//     res.status(err.statusCode || 500).json({
//       success: false,
//       message: err.message,
//       error: err.stack
//     })
//   }
// }