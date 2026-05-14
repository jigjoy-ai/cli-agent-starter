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
} from '@mozaik-ai/core'

// BaseAgentParticipant requires InputStream; this CLI only uses onMessage.
const programmaticAgentInputStub: InputStream = {
	async *stream() {},
}

export class TerminalAgent extends BaseAgentParticipant {
	private pendingCalls = new Set<string>()

	constructor(inferenceRunner: InferenceRunner, functionCallRunner: FunctionCallRunner, private readonly environment: AgenticEnvironment, private readonly context: ModelContext, private readonly model: GenerativeModel) {
		super(programmaticAgentInputStub, inferenceRunner, functionCallRunner)
	}

	override onMessage(message: string): void {

		const developerMessage = DeveloperMessageItem.create(`You are a terminal agent. You can run commands in the terminal to help the user with their request.`)

		this.context.addContextItem(developerMessage).addContextItem(UserMessageItem.create(message))
		this.runInference(this.environment, this.context, this.model)
	}

	override onFunctionCall(item: FunctionCallItem) {
		this.pendingCalls.add(item.callId)
		this.context.addContextItem(item)
		this.executeFunctionCall(this.environment, item)
	}

	override onFunctionCallOutput(item: FunctionCallOutputItem) {
		this.context.addContextItem(item)
		this.pendingCalls.delete(item.callId)
		if (this.pendingCalls.size === 0) {
			this.runInference(this.environment, this.context, this.model)
		}
	}
}
