/* eslint-disable no-undef */
import Ajv from 'ajv';
import { readJsonFile, resolveFilePath } from './utils.mjs';

const ajv = new Ajv();

const optionsDir = resolveFilePath('extension', 'options');
const schemePath = resolveFilePath(optionsDir, 'data.schema.json');
const dataPath = resolveFilePath(optionsDir, 'data.json');

const schema = readJsonFile(schemePath);
const options = readJsonFile(dataPath);

console.log('Validating options...\n');

const validate = ajv.compile(schema);
const valid = validate(options);

if (!valid) {
  console.log(validate.errors);
  console.error('\nSome options are invalid. See the above error messages for more information.');
  process.exit(1);
}

console.log('Options are valid.');
