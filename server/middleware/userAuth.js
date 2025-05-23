import jwt from 'jsonwebtoken';

const userAuth = (req, res, next) => {
    const {token} = req.cookies;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized. Login Again' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (decoded.id){
           req.user = { id: decoded.id };
           next();
        }else{
            return res.status(401).json({ message: 'Unauthorized. Login Again' });
        }


    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}

export default userAuth; 