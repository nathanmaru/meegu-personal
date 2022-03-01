import { useRouter } from 'next/router';
import { useState } from 'react';
import { useEffect } from 'react';
import React from 'react';
import Cookies from 'js-cookie';
import Image from 'next/image';

import { Button } from '@mui/material';

import styles from './tabs.module.scss';
import SubsCard from '../../reusable/subsCard';
import CustomizedDialogs from '../../reusable/dialog2';
import UtilityCard from '../../reusable/utilityCard';
import Paypal from '../../../helpers/paypal';
// import { PayPalButtons } from '@paypal/react-paypal-js';

import promoPic from '../../../public/classroom.png';
import transactionImg from '../../../public/notification_icon.png';
import { AiOutlineDollar } from 'react-icons/ai';

function SubscriptionTab({ institutionID }) {
	const [plans, setPlans] = useState([]);
	const [transactionList, setTransactionList] = useState([]);
	const router = useRouter();

	async function fetchPlans() {
		const request = await fetch(process.env.BACKEND_API_UR + `/transactions/plans`, {
			headers: {
				Authorization: `Bearer ${Cookies.get('access_token')}`,
			},
		});
		const result = await request.json();
		console.log(result);
		setPlans(result);
	}

	async function fetchTransactions() {
		const request = await fetch(
			process.env.BACKEND_API_UR + `/transactions?institution=${institutionID}`,
			{
				headers: {
					Authorization: `Bearer ${Cookies.get('access_token')}`,
				},
			}
		);
		const result = await request.json();
		console.log('transaction', result);
		setTransactionList(result);
	}

	useEffect(() => {
		fetchPlans();
		fetchTransactions();
	}, []);
	return (
		<>
			<div className={styles.subscriptionContainer}>
				<div className={styles.subsContainerItem}>
					<div>
						<CustomizedDialogs
							title='Buy Subscription'
							openBtn={<Button>Buy Subscription</Button>}
							maxWidth='md'
						>
							<h3>Please Select Your Plan </h3>
							<br />
							<div className='card-container'>
								{plans?.map((plan) => (
									<CustomizedDialogs
										key={plan.id}
										title='Buy Subscription'
										openBtn={
											<UtilityCard illustration={promoPic} title={plan.name}>
												<p>
													<em>PHP {plan.price}</em>
												</p>
												<p>{plan.description}</p>
											</UtilityCard>
										}
									>
										<Paypal institution={institutionID} plan={plan} />
									</CustomizedDialogs>
								))}
							</div>
						</CustomizedDialogs>
					</div>
				</div>

				<div className={styles.subsContainerItem}>
					<SubsCard
						title={transactionList[0] ? transactionList[0].plan.name : 'None'}
						subtitle='Latest Subscription Plan'
					></SubsCard>

					<div className={styles.transactionList}>
						{transactionList?.map((item) => (
							<div key={item.id} className={styles.transaction}>
								<div className={styles.transaction_icon}>
									<AiOutlineDollar />
								</div>
								<div className={styles.list}>
									<div className={styles.listHeader}>
										<p className={styles.transaction_highlight}>
											You&#39;ve successfully subscribed to our {item.plan.name}!
										</p>

										<p className={styles.date}>date here</p>
									</div>
									<p className={styles.transaction_message}>
										Please enjoy the services we offer for just{' '}
										<strong>{item.plan.price}</strong>
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</>
	);
}

export default SubscriptionTab;
