
const UserModel = require('../Models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.registerUser = async (req, res) => {
    const { email, password, name} = req.body;
  
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }
  
    try {
      const userExists = await UserModel.findOne({ email });
      const nameExists = await UserModel.findOne({ name });
      if (userExists) {
        return res.status(400).json({ error: 'El email ya está registrado' });
      } else if (nameExists){
        return res.status(400).json({ error: 'El nombre ya está registrado' });
      }
  
      const newUser = new UserModel({ email, password, name });
      await newUser.save();
      res.status(201).json({ message: 'Usuario registrado exitosamente' }); 
    } catch (err) {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
};


exports.loginUser = async (req, res) => {
    const { email, password,name } = req.body;

    // Validar los campos requeridos
    if (!email || !password || !name) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    try {
        // Verificar las credenciales del usuario
        const user = await UserModel.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        // Crear un token de acceso
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

        // Establecer la cookie con el token
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Solo en producción
            sameSite: 'none',   // Previene ataques CSRF
        });

        res.json({ message: 'Inicio de sesión exitoso', token }); // Enviar el token en la respuesta
    } catch (err) {
        res.status(500).json({ error: 'Error en el servidor: ' + err.message });
    }
};



exports.logoutUser = (req, res) => {
    // Eliminar la cookie de sesión
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
    });
    res.json({ message: 'Cierre de sesión exitoso' });
};




exports.verifyEmail = async (req, res) => {
    const {email} = req.body

    try{
         // Verificar que el correo coincida con el del usuario logueado

        const user = await UserModel.findOne({email, _id: req.user.id})
        if (!user){
            return res.status(404).json({message: 'Correo Incorrecto'})
        }
        res.status(200).json({message: 'Correo verificado', userId: user._id})
    } catch (error) {
        res.status(500).json({message: 'Error del servidor'})
    }
}

exports.changeUsername = async (req, res) => {
    const { newName } = req.body;
    const userId = req.user.id;

    if (!newName) {
        return res.status(400).json({ error: 'El nuevo nombre es requerido' });
    }

    try {
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const nameExists = await UserModel.findOne({ name: newName });
        if (nameExists) {
            return res.status(400).json({ error: 'El nombre ya está registrado' });
        }

        user.name = newName;
        await user.save();

        res.status(200).json({ message: 'Nombre de usuario actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor: ' + error.message });
    }
};




exports.changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id; // Obtiene el ID del usuario autenticado

    // Validaciones básicas
    if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Ambas contraseñas son requeridas' });
    }

    if (newPassword.length < 8) {
        return res.status(400).json({ error: 'La nueva contraseña debe tener al menos 8 caracteres' });
    }

    try {
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // 2. Verificar la contraseña actual
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ error: 'Contraseña actual incorrecta' });
        }

        // 3. Hashear y guardar la nueva contraseña
        user.password = newPassword; // El pre-hook 'save' en el modelo se encargará del hashing
        await user.save();

        res.json({ message: 'Contraseña actualizada exitosamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.validateToken = (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]
    
    if (!token) {
        return res.status(401).json({ message: "Token not provided" })  
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        res.status(200).json({ message: 'Token válido', user: decoded });
    } catch (err) {
        res.status(401).json({ message: 'Token inválido' });
    }

}

