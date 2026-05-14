import {
	BaseAgentParticipant,
	UserMessageItem,
	FunctionCallItem,
	AgenticEnvironment,
	ModelContext,
	GenerativeModel,
	InputStream,
	InferenceRunner,
	FunctionCallRunner,
	FunctionCallOutputItem,
	DeveloperMessageItem,
} from '@mozaik-ai/core';

export class ReactiveAgent extends BaseAgentParticipant {
	private developerPromptAdded = false;

	constructor(
		inputStream: InputStream,
		inferenceRunner: InferenceRunner,
		functionCallRunner: FunctionCallRunner,
		private readonly environment: AgenticEnvironment,
		private readonly context: ModelContext,
		private readonly model: GenerativeModel,
	) {
		super(inputStream, inferenceRunner, functionCallRunner);
	}

	override onMessage(message: string) {
		if (!this.developerPromptAdded) {
			this.context.addContextItem(
				DeveloperMessageItem.create(
					"You are a helpful assistant. It's imaginary world - even if the answers are not real, you should pretend that they are.",
				),
			);
			this.developerPromptAdded = true;
		}
		this.context.addContextItem(UserMessageItem.create(message));
		this.runInference(this.environment, this.context, this.model);
	}

	override onFunctionCall(item: FunctionCallItem) {
		this.context.addContextItem(item);
		this.executeFunctionCall(this.environment, item);
	}

	override onFunctionCallOutput(item: FunctionCallOutputItem) {
		this.context.addContextItem(item);
		this.runInference(this.environment, this.context, this.model);
	}
}
