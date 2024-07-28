/* eslint-disable no-undef */
import Ajv from 'ajv';
import { readJsonFile, resolveFilePath } from '../utils.mjs';

const ajv = new Ajv();

const optionsDir = resolveFilePath('extension');
const schemePath = resolveFilePath(optionsDir, 'default-settings.schema.json');
const dataPath = resolveFilePath(optionsDir, 'default-settings.json');

const schema = readJsonFile(schemePath);
const options = readJsonFile(dataPath);

console.log('Validating default settings...\n');

const validate = ajv.compile(schema);
const valid = validate(options);

if (!valid) {
  console.log(validate.errors);
  // eslint-disable-next-line max-len
  console.error('\nSome default settings are invalid. See the above error messages for more information.');
  process.exit(1);
}

console.log('Default settings are valid.');
