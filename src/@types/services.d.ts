import { Field, Option } from "@prisma/client";

export type FieldWithOptions = Field & { options: Option[] }
