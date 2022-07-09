/* check token middleware for protected routes */
export default function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  if(!bearerHeader) return res.status(403).send("Error: Invalid authorization header");
  const token = bearerHeader.split(" ")[1];
  if(!token) return res.status(403).send(`Error: Invalid token`);
  req.token = bearerHeader.split(" ")[1];
  next();
}