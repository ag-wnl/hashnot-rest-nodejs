import admin from "firebase-admin";

export const verifyFirebaseToken = async (req, res, next) => {
    const idToken = req.headers.authorization;

    if (!idToken) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized - Token missing' });
    }
  
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      req.user = decodedToken;
      next();
    } catch (error) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized - Invalid token' });
    }
};