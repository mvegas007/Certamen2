import { randomUUID, randomBytes } from "crypto";
import { loginSchema, reminderSchema, updateReminderSchema } from "./schemas.js";
import { validateSchema, authMiddleware } from "./middleware.js";
import { verifyPassword } from "./utils.js";

export function setupRoutes(app) {
    const reminders = [];
    app.locals.reminders = reminders;
    
    app.post("/api/auth/login", validateSchema(loginSchema), async (req, res) => {
        const { username, password } = req.body;
        const user = app.locals.users.find((user) => user.username === username);

        if (!user || !await verifyPassword(password, user.password)) {
            return res.status(401).json({
                error: "Nombre de usuario o contraseña incorrectos",
            });
        }
        
        user.token = randomBytes(48).toString("hex");

        res.json({
            username: user.username,
            token: user.token,
            name: user.name
        });
    });

    app.get("/api/reminders", authMiddleware, (req, res) => {
        res.json(reminders.toSorted((a, b) => {
            if (a.important && !b.important) return -1;
            if (!a.important && b.important) return 1;
            return a.createdAt - b.createdAt;
        }));
    });

    app.post("/api/reminders", authMiddleware, validateSchema(reminderSchema), (req, res) => {
        const { content, important } = req.body;

        const newReminder = {
            id: randomUUID(),
            content: content.trim(),
            createdAt: Date.now(),
            important: important ?? false,
        };

        reminders.push(newReminder);
        res.status(201).json(newReminder);
    });

    app.patch("/api/reminders/:id", authMiddleware, validateSchema(updateReminderSchema), (req, res) => {
        const { id } = req.params;
        const { content, important } = req.body;

        const reminder = reminders.find((reminder) => reminder.id === id);

        if (!reminder) {
            return res.status(404).json({
                error: "Recordatorio no encontrado",
            });
        }

        if (content !== undefined) {
            reminder.content = content.trim();
        }

        if (important !== undefined) {
            reminder.important = important;
        }

        res.json(reminder);
    });

    app.delete("/api/reminders/:id", authMiddleware, (req, res) => {
        const { id } = req.params;
        const reminderIndex = reminders.findIndex((reminder) => reminder.id === id);

        if (reminderIndex === -1) {
            return res.status(404).json({
                error: "Recordatorio no encontrado",
            });
        }

        reminders.splice(reminderIndex, 1);
        res.status(204).end();
    });
} 