export const FormValidationText = ({
  isValid,
  text,
}: {
  isValid: boolean
  text: string
}) => {
  return <p className={`${!isValid && "text-red-400"} mt-1 text-sm`}>{text}</p>
}
