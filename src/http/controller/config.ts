import serviceCalculators from '../../services';

export function config() {
  return Object.keys(serviceCalculators).map((key) => {
    const service = serviceCalculators[key];
    return service.config;
  })
}