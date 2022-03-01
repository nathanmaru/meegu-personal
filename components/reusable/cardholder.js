const CardHolder = (props) => {
	return (
		<>
			<div>
				<div className="flex flex-row flex-wrap w-full items-center">
					{props.children}
				</div>
			</div>
		</>
	);
};

export default CardHolder;
