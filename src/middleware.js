import { parse } from "valibot";

export function validateSchema(schema) {
    return (req, res, next) => {
        try {
            req.body = parse(schema, req.body);
            next();
        } catch (error) {
            res.status(400).json({
                error: error.message
            });
        }
    };
}

export function authMiddleware(req, res, next) {
    const token = req.get("X-Authorization");

    if (!token) {
        return res.status(401).json({
            error: "No se ha proporcionado un token de autorización",
        });
    }

    const user = req.app.locals.users.find(user => user.token === token);

    if (!user) {
        return res.status(401).json({
            error: "El token es inválido"
        });
    }

    next();
} 