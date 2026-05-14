import {
	Participant,
	FunctionCallItem,
	FunctionCallOutputItem,
	ModelMessageItem,
	ReasoningItem,
} from '@mozaik-ai/core';

type Listeners = {
	onAssistantText: (text: string) => void;
	onFunctionCall?: (name: string) => void;
};

export class UIParticipant extends Participant {
	constructor(private readonly listeners: Listeners) {
		super();
	}

	onMessage(_message: string) {}

	onFunctionCall(item: FunctionCallItem) {
		this.listeners.onFunctionCall?.(item.toJSON()?.name ?? 'tool');
	}

	onFunctionCallOutput(_item: FunctionCallOutputItem) {}

	onReasoning(_item: ReasoningItem) {}

	onModelMessage(item: ModelMessageItem) {
		const text = item.content?.text ?? '';
		if (text) this.listeners.onAssistantText(text);
	}

	onExternalFunctionCall(_source: Participant, item: FunctionCallItem) {
		this.listeners.onFunctionCall?.(item.toJSON()?.name ?? 'tool');
	}

	onExternalFunctionCallOutput(
		_source: Participant,
		_item: FunctionCallOutputItem,
	) {}

	onExternalReasoning(_source: Participant, _item: ReasoningItem) {}

	onExternalModelMessage(_source: Participant, item: ModelMessageItem) {
		const text = item.content?.text ?? '';
		if (text) this.listeners.onAssistantText(text);
	}
}
