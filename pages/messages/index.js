import { Avatar, Button, IconButton, TextField } from '@mui/material';
import React from 'react';
import { useForm } from 'react-hook-form';
import { CgOptions } from 'react-icons/cg';
import PageLayout from '../../layouts/pageLayout';
import styles from './messages.module.scss';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import CustomizedDialogs from '../../components/reusable/dialog2';
import { useState } from 'react';
import { useUser } from '../../contexts/userProvider';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { useEffect } from 'react';

function MessagesPage({ conversations, messages, conversation }) {
	const user = useUser();
	const router = useRouter();
	const [conversationList, setConversationList] = useState(conversations);
	const [messageList, setMessageList] = useState(messages);
	const [selectedConversation, setSelectedConversation] = useState(conversation);
	const { register, handleSubmit } = useForm();

	const {
		register: sendMessageRegister,
		handleSubmit: sendMessageSubmit,
		resetField: sendMessageReset,
	} = useForm();
	const {
		register: createConvoRegister,
		handleSubmit: createConvoSubmit,
		resetField: createConvoReset,
	} = useForm();

	async function addConversation(data, e) {
		e.preventDefault();
		console.log(data);
	}

	function getReceiver(convo) {
		console.log(convo);
		if (convo) {
			const filtered = convo?.filter((member) => member.id != user?.id);
			return filtered[0];
		}
	}

	async function getMessages(convo) {
		const request = await fetch(process.env.BACKEND_API_UR + `/chats/messages?convo=${convo}`, {
			headers: {
				Authorization: `Bearer ${Cookies.get('access_token')}`,
			},
		});
		const result = await request.json();
		console.log(result);
		setMessageList(result);
	}

	async function getCurrentConvo(convo) {
		const request = await fetch(process.env.BACKEND_API_UR + `/chats/${convo}`, {
			headers: {
				Authorization: `Bearer  ${Cookies.get('access_token')}`,
			},
		});
		const result = await request.json();
		console.log(result);
		setSelectedConversation(result);
	}

	async function sendMessage(data, e) {
		e.preventDefault();
		console.log();
		const request = await fetch(process.env.BACKEND_API_UR + `/chats/messages`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer  ${Cookies.get('access_token')}`,
			},
			body: JSON.stringify({
				content: data.content,
				conversation: selectedConversation.id,
				sender: user.id,
				receiver: getReceiver(selectedConversation.members).id,
			}),
		});
		const result = await request.json();
		console.log(result);
		setMessageList([result, ...messageList]);
		sendMessageReset('content');
	}

	async function createConversation(data, e) {
		// e.preventDefault();
		console.log([user.username, data.username]);
		const request = await fetch(process.env.BACKEND_API_UR + `/chats/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer  ${Cookies.get('access_token')}`,
			},
			body: JSON.stringify({
				members: [user.username, data.username],
				name: `${user.username} - ${data.username}`,
				isActive: true,
			}),
		});
		const result = await request.json();
		console.log(result);
		setSelectedConversation(result);
		setConversationList([result, ...conversationList]);
		setMessageList([]);
	}
	return (
		<>
			<header className={styles.page__header}>
				<h1 className={styles.page__title}>Messages</h1>
			</header>
			<main className={styles.page__content}>
				<section className={styles.conversation__container}>
					<div className={styles.conversation__containerHeader}>
						<form className={styles.right}>
							<div className={styles.conversation__searchbox}>
								<input
									className={styles.searchInput}
									type='search'
									placeholder='Search Conversation...'
								/>

								<SearchIcon />
							</div>
						</form>
						<CustomizedDialogs
							title='Add Coversation Room'
							openBtn={<button className={styles.conversation__addBtn}>&#43;</button>}
							primaryAction={
								<Button onClick={handleSubmit(createConvoSubmit(createConversation))}>
									Create
								</Button>
							}
						>
							<form onSubmit={handleSubmit(createConvoSubmit(createConversation))}>
								<TextField
									label='Sender username'
									{...createConvoRegister('username')}
									fullWidth
								/>
								{/* <input type='text' {...register('name')} placeholder='Chat Name' /> */}
							</form>
						</CustomizedDialogs>
					</div>

					<ul className={styles.conversation__list}>
						{conversationList?.map((convo) => (
							<li
								key={convo.id}
								className={`${styles.conversation} ${
									selectedConversation && selectedConversation.id === convo.id
										? styles.active
										: ''
								}`}
								onClick={() => {
									router.push(
										`/messages?user=${user.id}&room=${convo.id}#messageContainer`,
										undefined,
										{ shallow: true }
									);
									getMessages(convo.id);
									getCurrentConvo(convo.id);
								}}
							>
								<div className={styles.convo__split}>
									<Avatar
										src={
											getReceiver(convo.members)?.profileImage &&
											getReceiver(convo.members)?.profileImage
										}
									/>
									{`${getReceiver(convo.members)?.first_name} ${
										getReceiver(convo.members)?.last_name
									}`}
								</div>
							</li>
						))}
					</ul>
				</section>
				<section id='messageContainer' className={styles.message__container}>
					<header className={styles.message__containerHeader}>
						<h2 className={styles.message__convoName}>
							{selectedConversation
								? `${getReceiver(selectedConversation?.members)?.first_name} ${
										getReceiver(selectedConversation?.members)?.last_name
								  }`
								: 'Please select a conversation'}
						</h2>
						<IconButton>
							<CgOptions />
						</IconButton>
					</header>
					<ul className={styles.message__list}>
						{messageList?.map((message) => (
							<li key={message.id} className={styles.message}>
								<Avatar src={message.sender.profileImage} />
								<div>
									<p>
										<strong>
											{message.sender.first_name} {message.sender.last_name}
										</strong>
									</p>
									{message.content}
								</div>
							</li>
						))}
					</ul>
					<form onSubmit={sendMessageSubmit(sendMessage)} className={styles.message__form}>
						<TextField
							multiline
							fullWidth
							minRows={4}
							label='Type Message...'
							className='textField'
							color='primary'
							{...sendMessageRegister('content')}
						/>
						<Button type='submit'>Send Message</Button>
					</form>
				</section>
			</main>
		</>
	);
}

export async function getServerSideProps({ req, query }) {
	const { access_token } = req.cookies;
	const { user, room } = query;
	const props = {};

	const request = await fetch(process.env.BACKEND_API_UR + `/chats`, {
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	});
	const result = await request.json();
	console.log(result);
	props.conversations = result;

	if (room) {
		const getMessages = await fetch(
			process.env.BACKEND_API_UR + `/chats/messages?convo=${room}`,
			{
				headers: {
					Authorization: `Bearer ${access_token}`,
				},
			}
		);
		const messagesResult = await getMessages.json();
		console.log(messagesResult);
		props.messages = messagesResult;

		const getCurrentConvo = await fetch(process.env.BACKEND_API_UR + `/chats/${room}`, {
			headers: {
				Authorization: `Bearer ${access_token}`,
			},
		});
		const convoResult = await getCurrentConvo.json();
		console.log(convoResult);
		props.conversation = convoResult;
	}

	return { props };
}

MessagesPage.Layout = PageLayout;
export default MessagesPage;
