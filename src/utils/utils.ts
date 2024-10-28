export function handleErrorResponse(context: any, message: string, statusCode: number) {
  console.error(message);
  return context.json({ message }, statusCode);
}