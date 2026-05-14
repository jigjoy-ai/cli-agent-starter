import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Box, Text, useApp, useInput} from 'ink';
import TextInput from 'ink-text-input';
import BigText from 'ink-big-text';
import Gradient from 'ink-gradient';
import {createAgentSession} from './agent.js';

type ChatMessage = {
	id: number;
	role: 'user' | 'assistant' | 'system';
	content: string;
};

export default function App() {
	const {exit} = useApp();
	const [input, setInput] = useState('');
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [isThinking, setIsThinking] = useState(false);
	const nextId = useRef(0);

	const appendMessage = (role: ChatMessage['role'], content: string) => {
		setMessages(prev => [...prev, {id: nextId.current++, role, content}]);
	};

	const session = useMemo(
		() =>
			createAgentSession({
				onAssistantText: text => {
					setIsThinking(false);
					appendMessage('assistant', text);
				},
				onFunctionCall: name => {
					appendMessage('system', `calling tool: ${name}`);
				},
			}),
		[],
	);

	useEffect(() => {
		appendMessage(
			'system',
			'Type a message and press Enter. Use /exit or Ctrl+C to quit.',
		);
	}, []);

	useInput((_inputChar, key) => {
		if (key.escape) exit();
	});

	const handleSubmit = (value: string) => {
		const trimmed = value.trim();
		if (!trimmed) return;
		if (trimmed === '/exit' || trimmed === '/quit') {
			exit();
			return;
		}
		setInput('');
		appendMessage('user', trimmed);
		setIsThinking(true);
		session.send(trimmed);
	};

	return (
		<Box flexDirection="column" paddingX={1}>
			<Box
				flexDirection="column"
				borderStyle="round"
				borderColor="cyan"
				paddingX={0}
				paddingY={0}
			>
				<Gradient name="pastel">
					<BigText text="Mozaik CLI" font="block" />
				</Gradient>
				<Text dimColor>Welcome! Chat with your agent. /exit to quit.</Text>
			</Box>

			<Box flexDirection="column" marginTop={1}>
				{messages.map(message => (
					<MessageRow key={message.id} message={message} />
				))}
				{isThinking && (
					<Text color="yellow">
						<Text bold>Agent</Text> is thinking…
					</Text>
				)}
			</Box>

			<Box marginTop={1}>
				<Text color="cyan">{'> '}</Text>
				<TextInput
					value={input}
					onChange={setInput}
					onSubmit={handleSubmit}
					placeholder="ask me anything…"
				/>
			</Box>
		</Box>
	);
}

function MessageRow({message}: {message: ChatMessage}) {
	if (message.role === 'system') {
		return (
			<Text dimColor italic>
				· {message.content}
			</Text>
		);
	}

	const label = message.role === 'user' ? 'You' : 'Agent';
	const color = message.role === 'user' ? 'green' : 'magenta';

	return (
		<Box flexDirection="column" marginBottom={0}>
			<Text>
				<Text color={color} bold>
					{label}
				</Text>
				<Text>{': '}</Text>
				<Text>{message.content}</Text>
			</Text>
		</Box>
	);
}
