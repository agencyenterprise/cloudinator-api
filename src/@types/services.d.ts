interface ServiceConfig {
  title: string;
  name: string;
  type: string;
  logo: string;
  description: string;
  fields: Fields[]
}

interface Fields {
  title: string;
  name: string;
  type: string;
  defaultValue: number | string;
  required: boolean;
  options?: Options[]
}

interface Options {
  value: number | string;
  label: string;
}