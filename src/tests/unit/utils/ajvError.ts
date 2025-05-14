import { ErrorObject } from "ajv";

const ajvError = (err: unknown) => {
    const messageOfError: string = (err as Error).message;
    const errors: ErrorObject[] = JSON.parse(messageOfError);
    if (errors.length != 1) {
        return errors.map(e => {
            return {
                instancePath: e.instancePath,
                message: e.message
            }
        })
    } else {
        if (errors[0].instancePath.length == 0)
            return errors[0].message!;

        return errors[0].instancePath + " " + errors[0].message!;
    }
};

export default ajvError;