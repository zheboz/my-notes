import ratelimit from "../config/upslash.js";

const rateLimiter = async (req, res, next) => {
  try {

    const { success } = await ratelimit.limit("mlk");//mlk可以设置成用户的id或者ip
    if (!success) {
      return res.status(429).json({ message: "Too many requests" });
    }
    next();
  } catch (error) {
    console.log("error", error);
    next(error);
  }
};

export default rateLimiter;
