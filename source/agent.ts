import {
	AgenticEnvironment,
	Gpt54,
	ModelContext,
	OpenAIInferenceRunner,
	DefaultFunctionCallRunner,
	InputStream,
} from '@mozaik-ai/core';
import {capitalOfFranceTool} from './capital-of-france-tool.js';
import {ReactiveAgent} from './reactive-agent.js';
import {UIParticipant} from './ui-participant.js';

class NoopInputStream implements InputStream {
	async *stream(signal?: AbortSignal): AsyncIterable<string> {
		await new Promise<void>(resolve => {
			if (!signal) return;
			if (signal.aborted) return resolve();
			signal.addEventListener('abort', () => resolve(), {once: true});
		});
	}
}

export type AgentSession = {
	send: (message: string) => void;
};

export type AgentListeners = {
	onAssistantText: (text: string) => void;
	onFunctionCall?: (name: string) => void;
};

export function createAgentSession(listeners: AgentListeners): AgentSession {
	const functionCallRunner = new DefaultFunctionCallRunner([
		capitalOfFranceTool,
	]);
	const inputSource = new NoopInputStream();
	const inferenceRunner = new OpenAIInferenceRunner();

	const context = ModelContext.create('cli-agent');
	const model = new Gpt54();
	model.setTools([capitalOfFranceTool]);

	const environment = new AgenticEnvironment();
	const agent = new ReactiveAgent(
		inputSource,
		inferenceRunner,
		functionCallRunner,
		environment,
		context,
		model,
	);
	const ui = new UIParticipant(listeners);

	environment.start();
	agent.join(environment);
	ui.join(environment);

	return {
		send: (message: string) => agent.onMessage(message),
	};
}
