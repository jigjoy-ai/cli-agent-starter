#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
import meow from 'meow';
import dotenv from 'dotenv';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import App from './app.js';

const here = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({
	path: [
		path.resolve(process.cwd(), '.env'),
		path.resolve(here, '..', '..', '.env'),
		path.resolve(here, '..', '..', '..', '.env'),
	],
});

meow(
	`
	Usage
	  $ cli-agent

	Starts an interactive chat with the Mozaik agent.
	Type your message and press Enter. Use /exit to quit.
`,
	{
		importMeta: import.meta,
	},
);

render(<App />);
