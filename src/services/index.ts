import * as sendGrid from './sendgrid';

interface Services {
  [key: string]: any;
}

export default {
  sendGrid
} as Services;