import { z } from "zod"

// ** tips : Using .coerce.number() to solve number problem
const exampleSchema = z.object({})

// ** types
export type exampleKeys = keyof z.infer<typeof exampleSchema>