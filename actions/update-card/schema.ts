import * as z from "zod";

export const UpdateCard = z.object({
    description: z.optional(z.string({
        required_error: "Description is required",
        invalid_type_error: "Description is required"
    }).min(3, {
        message: "Description is too short"
    })),
    boardId: z.string(),
    title: z.optional(z.string({
        required_error: "Title is required",
        invalid_type_error: "Title is too short"
    }).min(3, {
        message: "Title is too short"
    })),
    id: z.string()
});