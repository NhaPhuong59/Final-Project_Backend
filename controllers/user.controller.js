const { catchAsync, sendResponse } = require("../helpers/utils");
const Users = require("../models/Users");
const bcrypt = require("bcryptjs");

const usersController = {};

// usersController.createUser = async (req, res, next) => {
//         const {userName, email, password} = req.body;
//         try {
//             let user = await Users.create({
//                 userName,
//                 email,
//                 password
//             })
//           return  res.status(201).send({data:{user}, messages:"Register Success"})

//     } catch (error) {
//        return res.status(400).send(error)
//     }
// }

usersController.createUser = catchAsync(async (req, res, next) => {
  let { userName, email, password } = req.body;
  let user = await Users.findOne({ email }, "+password");
  if (user) {
    throw new Error(409, "User already exists");
  }
  const salt = await bcrypt.genSalt(12);
  password = await bcrypt.hash(password, salt);

  user = await Users.create({
    userName,
    email,
    password,
  });

  const accessToken = user.generateToken()

  return sendResponse(
    res,
    200,
    true,
    { user, accessToken },
    null,
    "Create user successful"
  );
});

usersController.userLogin = catchAsync( async (req, res, next) => {
  const { email, password } = req.body;
  const user = await Users.findOne({email}, "+password");
  console.log("userLogin", user)
  if(!user){
      throw new Error(400, "User not found");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error(400, "Invalid credentials");
  }
  const accessToken = user.generateToken();
  res.cookie('session',accessToken, { httpOnly: true });
  return sendResponse(res, 200,true, { user, accessToken }, null, "successful")
//   try {
//     const user = await Users.findOne({ email: email });
//     return res.status(201).send({ data: { user }, messages: "Login Success" });
//   } catch (error) {
//     return res.status(400).send(error);
//   }
});

usersController.getCurrentUser = catchAsync( async (req, res, next)=>{
  const {currentUserId} = req
  console.log(currentUserId)
  const currentUser = await Users.findById(currentUserId);
  console.log(currentUser)
  if (!currentUser){
    throw new Error(404, "User not found")
  }
  return sendResponse(res, 200, currentUser, null, "successful")
})

module.exports = usersController;
