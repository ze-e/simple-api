import jwt from "jsonwebtoken";

/* check token middleware for protected routes */
export default async function verifyToken(req, res, next) {
  //check if token is valid
  const authHeader = req.headers['authorization'];
  if(!authHeader ||!authHeader.startsWith('Bearer ')) return res.status(401).send("Error: Invalid header");
  
  //get user
  const token = authHeader.replace('Bearer ', '');
  try{
    req.user = await jwt.verify(token, process.env.SECRETKEY).user;
  }
  catch(e){
    return res.status(403).send(`Error: Invalid token`);
  }

  next();
}