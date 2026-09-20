import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { signToken } from "../middleware/auth.js";

const publicUser = (user) => ({
  id: user._id.toString(),
  email: user.email,
});

export async function register(req, res) {
  const email = req.body?.email?.trim().toLowerCase();
  const password = req.body?.password;

  if (!email || typeof password !== "string" || password.length < 8) {
    return res.status(400).json({
      message: "Email and a password of at least 8 characters are required",
    });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email is already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ email, passwordHash });

    return res.status(201).json({
      token: signToken(user),
      user: publicUser(user),
    });
  } catch (error) {
    console.error("Error registering user", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function login(req, res) {
  const email = req.body?.email?.trim().toLowerCase();
  const password = req.body?.password;

  if (!email || typeof password !== "string") {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    const passwordMatches = user
      ? await bcrypt.compare(password, user.passwordHash)
      : false;

    if (!user || !passwordMatches) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    return res.json({
      token: signToken(user),
      user: publicUser(user),
    });
  } catch (error) {
    console.error("Error logging in user", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getCurrentUser(req, res) {
  try {
    const user = await User.findById(req.user.sub).select("email");
    if (!user) {
      return res.status(401).json({ message: "User no longer exists" });
    }
    return res.json({ user: publicUser(user) });
  } catch (error) {
    console.error("Error getting current user", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
