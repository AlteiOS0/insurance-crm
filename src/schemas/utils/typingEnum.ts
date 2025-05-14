import { Type } from "@sinclair/typebox";

const StringEnum = <T extends string[]>(items: [...T]) => Type.Unsafe<T[number]>({ type: "string", enum: items });

export default StringEnum