import argon2 from "argon2";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET

export function verifyToken(token) {
  if (!token) return null;

  try {
   
    const decoded = jwt.verify(token, SECRET);
    
   
    return decoded; 
  } catch (error) {
    
    console.error("[SEGURIDAD]: Intento de acceso con token inválido.");
    return null;
  }
}



const argonOptions = {
    type: argon2.argon2id, 
    memoryCost: 2 ** 16,   
    timeCost: 3,           
    parallelism: 4         
};


export async function hashPassword(password) {
    try {
        return await argon2.hash(password, argonOptions);
    } catch (err) {
        console.error("Error hasheando:", err);
        throw new Error("Error de seguridad interno");
    }
}


export async function verifyPassword(hashedPassword, password) {
    try {
        return await argon2.verify(hashedPassword, password);
    } catch (err) {
        console.error("Error verificando:", err);
        return false;
    }
}