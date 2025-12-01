// Este script NO debe ser parte del servidor. Es una herramienta única.

import bcrypt from 'bcrypt';

// 🚨 INSTRUCCIÓN: Cambia esta variable a la contraseña real de tu administrador.
// Si tu contraseña es "adminpass123", déjala así.
const PLAIN_PASSWORD = 'adminpass123'; 

// El "salt" (factor de dificultad) debe ser el mismo que usas en register.js (generalmente 10)
const SALT_ROUNDS = 10; 

async function generateHash() {
    try {
        console.log(`\nGenerando hash Bcrypt para la contraseña: "${PLAIN_PASSWORD}"`);
        
        // 1. Genera el hash
        const hash = await bcrypt.hash(PLAIN_PASSWORD, SALT_ROUNDS);
        
        console.log("==================================================");
        console.log("   ✅ HASH BCYPT GENERADO (COPIA ESTO):");
        console.log(`   ${hash}`);
        console.log("==================================================");
        console.log("INSTRUCCIÓN: Copia el hash de arriba (incluyendo $2b$...) y pégalo en el campo 'Pass' de tu usuario Administrador en MySQL.");

    } catch (error) {
        console.error("Error al generar el hash:", error);
    }
}

generateHash();