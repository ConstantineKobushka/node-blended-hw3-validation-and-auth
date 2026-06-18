export const getEnvVar = (name, defaltValue) => {
  const value = process.env[name];

  if (value !== undefined) return value;
  if (defaltValue !== undefined) return defaltValue;

  throw new Error(`Missing ${name} environment variable`);
};
