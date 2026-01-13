import { InvalidArgumentError } from "src/shared/contexts/exceptions/invalid-argument.error";

export class InvalidAuthEmailError extends InvalidArgumentError {
    constructor(value: string) {
        super(`The email <${value}> is not valid.`);
    }
}