type FieldTypes = {
    name: unknown,
    email: unknown,
    city: unknown
}
export function ValidateUserFields({ name, email, city }: FieldTypes) {
    if (
        typeof name !== 'string' || !name.trim() ||
        typeof email !== 'string' || !email.trim() ||
        typeof city !== 'string' || !city.trim()
    ) {
        return false;
    }
    return true;
}

export function ValidateUserId(id: number) {
    if (Number.isSafeInteger(id) || id > 0) {
        return true;
    }
    return false;
}