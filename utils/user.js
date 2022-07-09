//hides data we do not want to return in our response
export const sanitizeUser = user => {
  const userData = {...user};
  delete userData.password; 
  return userData;
}