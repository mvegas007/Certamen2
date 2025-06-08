import { object, string, boolean, minLength, maxLength, optional } from "valibot";

export const loginSchema = object({
    username: string([minLength(1)]),
    password: string([minLength(1)])
});

export const reminderSchema = object({
    content: string([minLength(1), maxLength(120)]),
    important: optional(boolean())
});

export const updateReminderSchema = object({
    content: optional(string([minLength(1), maxLength(120)])),
    important: optional(boolean())
}); 