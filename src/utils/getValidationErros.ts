import { ValidationError } from 'yup'

interface Errors {
  [key: string]: string
}
export default function getValidationErros(err: ValidationError): Errors {
  const allErros: Errors = {}

  err.inner.forEach((err) => {
    allErros[err.path] = err.message
  })

  return allErros
}
