import { Button, Snackbar } from '@mui/material';
import Cookies from 'js-cookie';
import { useRef, useEffect, useState } from 'react';

import { useUser } from '../contexts/userProvider';

export default function Paypal({ plan, institution }) {
	const paypal = useRef();
	const user = useUser();
	const [state, setState] = useState({
		open: false,
		vertical: 'top',
		horizontal: 'center',
	});

	const { vertical, horizontal, open } = state;
	const handleClose = () => {
		setState({ ...state, open: false });
	};

	async function buyPlan() {
		const request = await fetch(process.env.BACKEND_API_UR + '/transactions/', {
			method: 'POST',
			headers: {
				'Content-type': 'application/json',
				Authorization: `Bearer ${Cookies.get('access_token')}`,
			},
			body: JSON.stringify({ plan: plan.id, institution: institution }),
		});
		const result = await request.json();
		setState({ ...state, open: true });
		console.log(result);
	}

	useEffect(() => {
		if (typeof window !== 'undefined') {
			window.paypal
				.Buttons({
					createOrder: (data, actions, err) => {
						return actions.order.create({
							intent: 'CAPTURE',
							purchase_units: [
								{
									description: plan.name,
									amount: {
										currency_code: 'PHP',
										value: plan.price,
									},
								},
							],
						});
					},
					onApprove: async (data, actions) => {
						const order = await actions.order.capture();

						buyPlan();
					},
					onError: (err) => {
						console.log(err);
					},
				})
				.render(paypal.current);
		}
	}, []);

	return (
		<div>
			<script src='https://www.paypal.com/sdk/js?client-id=AUdBnNKW8cFcjXQ4XONeBm-rP9HRPgE2fg04K-YH33utmE-FaBKjKB_8JnKRoARP20vKfS8h3Dm62M4v&currency=PHP'></script>
			{plan.price == '0.00' ? (
				<>
					<div>
						<b>Price: </b>
						{plan.description}
					</div>
					<div className='flex w-full items-center justify-center'>
						<Button onClick={buyPlan}>Choose This</Button>
					</div>
				</>
			) : (
				<div ref={paypal}></div>
			)}

			<Snackbar
				anchorOrigin={{ vertical, horizontal }}
				open={open}
				onClose={handleClose}
				message='Subscription Plan Added!'
				key={vertical + horizontal}
			/>
		</div>
	);
}
