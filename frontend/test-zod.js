import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    ),
});

const resolver = zodResolver(schema);
resolver({ name: "", email: "test", password: "123" }, undefined, { fields: {} })
  .then(res => console.log("Resolver result:", JSON.stringify(res, null, 2)))
  .catch(err => console.error("Resolver error:", err));
