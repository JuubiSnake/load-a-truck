export enum ErrorType {
    DoesNotMatchSchema = "payload does not match the input schema",
    NotFound = "the requested resource could not be found",
    AlreadyExists = "attempted to create a resource that already exists",
    InternalError = "something went wrong when trying to perform the request"
}

export interface ErrorSchema {
    error: string
}