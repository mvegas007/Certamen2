import express from "express";
import { setupRoutes } from "./src/routes.js";

const PORT = process.env.PORT ?? 3000;
const app = express();

// Configuración inicial
app.locals.users = [
	{
		username: "admin",
		name: "Gustavo Alfredo Marín Sáez",
		password:
			"1b6ce880ac388eb7fcb6bcaf95e20083:341dfbbe86013c940c8e898b437aa82fe575876f2946a2ad744a0c51501c7dfe6d7e5a31c58d2adc7a7dc4b87927594275ca235276accc9f628697a4c00b4e01", // certamen123
	},
];

// Middleware
app.use(express.static("public"));
app.use(express.json());

// Configurar rutas
setupRoutes(app);

// Iniciar servidor
app.listen(PORT, (error) => {
	if (error) {
		console.error(`No se puede ocupar el puerto ${PORT} :(`);
		return;
	}
	console.log(`Escuchando en el puerto ${PORT}`);
});

export default app;
