import jwt from "jsonwebtoken";

const userAuth = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access Denied: No Token Provided" });
  }

  const token = authHeader.split(" ")[1]; // Extract token after "Bearer "
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    req.userId = decoded.userId; // Attach userId to request
    next(); // Proceed to the next middleware
  } catch (err) {
    return res.status(403).json({ message: "Invalid Token" });
  }
};

export default userAuth;
