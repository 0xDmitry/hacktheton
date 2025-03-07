import { z, ZodFormattedError } from "zod"

export const LevelApplicationSchema = z.object({
  name: z.string().min(1),
  telegramUsername: z.string().min(1),
  levelName: z.string(),
  goalAndHints: z.string().min(1),
  contract: z.string().min(1),
  solution: z.string().min(1),
})

type LevelApplication = z.infer<typeof LevelApplicationSchema>

export interface LevelApplicationFormState {
  errors?: ZodFormattedError<LevelApplication>
  message?: string
  resetKey?: number
}

export const sendLevelApplication = async (
  state: LevelApplicationFormState,
  formData: FormData,
) => {
  const parsedFormData = {
    name: formData.get("name"),
    telegramUsername: formData.get("telegramUsername"),
    levelName: formData.get("levelName"),
    goalAndHints: formData.get("goalAndHints"),
    contract: formData.get("contract"),
    solution: formData.get("solution"),
  }

  const validatedFields = LevelApplicationSchema.safeParse(parsedFormData)

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.format(),
    }
  }

  try {
    const response = await fetch("/api/level-application", {
      method: "POST",
      body: JSON.stringify(parsedFormData),
    })

    if (response.ok) {
      return {
        message: "success",
        resetKey: Date.now(),
      }
    } else {
      return {
        message: "fail",
      }
    }
  } catch {
    return {
      message: "fail",
    }
  }
}
