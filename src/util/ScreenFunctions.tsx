import React from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import GetProducts from "../Components/Inputs/GetProducts";
import SellingInfo from "../Components/Inputs/SellingInfo";
import ProductModifying from "../Components/Inputs/ProductModifying";
import ChangeRoles from "../Components/Inputs/ChangeRoles";
import SellInput from "../Components/Inputs/SellInput";
import {messagesInterface, Product, selection} from "../Components/mainScreens/Screen";
import "../styles/screenFunctions.css";
import {GraphQLClient} from "graphql-request";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

export function GetTiles(props: { role: string, handler: (e: React.MouseEvent<HTMLButtonElement>) => void }) {
	const {handler, role} = props;
	const options = [
		<LoadingButton
			key={"0 - Worker Manger"}
			size="large"
			onClick={handler}
			value="0"
			variant="contained"
		>Get Products
		</LoadingButton>,
		<LoadingButton
			key={"4 - Worker Manger"}
			size="large"
			onClick={handler}
			value="4"
			variant="contained">
			insert a sell
		</LoadingButton>,
		<LoadingButton
			key={"2 - Manger"}
			size="large"
			onClick={handler}
			variant="contained"
			value="2"
		>add/adjust product</LoadingButton>,
		<LoadingButton
			key={"1 - Manger"}
			size="large"
			onClick={handler}
			value="1"
			variant="contained">
			get the sells list
		</LoadingButton>,
		<LoadingButton
			key={"3 - Manger"}
			size="large"
			onClick={handler}
			value="3"
			variant="contained">
			change roles
		</LoadingButton>];
	return <div className="OptionsContainer">
		{options.filter((item) => {
			return ((item.key as string).includes(role));
		})
		}
	</div>;
}

export function ShowError(props: { messages: messagesInterface }) {
	(document.querySelector(".data-container") as HTMLDivElement)!.style.display = "flex";
	const {message, error} = props.messages;
	if (error)
		return <p className="message error">{error}</p>;
	else
		return <p className="message">{message}</p>;
}

function GetClientMassage(props: { quantity: number }) {
	const quantity = props.quantity;
	const isAvailable = quantity > 0;
	if (isAvailable) {
		return <div className={"clientMassage"}>
			<h1 className={"availableMassage"}>Available</h1>
			<CheckRoundedIcon sx={{color: "#18900a"}}/>
		</div>;
	} else {
		return <div className={"clientMassage"}>
			<h1 className={"soldOutMassage"}>Sold Out</h1>
			<CloseRoundedIcon sx={{color: "#900a0a"}}/>
		</div>;
	}
}

export function ShowData(props: { data: Array<Product>, role: string }) {
	const {data, role} = props;
	const isClient = role === "Client";
	const isManger = role === "Manger";
	return <>
		{data.map((item: Product, key) => {
			const {name, imgSrc, quantity, numberOfSales} = item;
			return <div key={key} className={"inner-data-container"}>
				<img src={imgSrc} alt="product image"/>
				<h1>{name}</h1>
				{isClient ?
					<GetClientMassage quantity={quantity}/>
					: <><h1>quantity: {quantity}</h1>
						{isManger && numberOfSales !== undefined && <h1>sales: {numberOfSales}</h1>}
					</>}
			</div>;
		})}
	</>;
}

export function GetContent(props: { role: string, timeOutExecutor: () => void, select: selection, clear: () => void, graphqlClient: GraphQLClient, showMessages: (messages: messagesInterface) => void, changeFunction: (data: Array<Product>) => void }) {
	const {
		select,
		changeFunction,
		showMessages,
		clear,
		graphqlClient,
		timeOutExecutor,
		role
	} = props;
	switch (select) {
	case selection.search:
		return <GetProducts
			role={role}
			timeOutExecutor={timeOutExecutor}
			graphqlClient={graphqlClient}
			changeFunction={changeFunction}
			showMessages={showMessages}
			clearData={clear}/>;
	case selection.getList:
		return <SellingInfo
			timeOutExecutor={timeOutExecutor}
			graphqlClient={graphqlClient}
			changeFunction={changeFunction}
			showMessages={showMessages}
			clearData={clear}/>;
	case selection.addAdjDelProduct:
		return <ProductModifying
			timeOutExecutor={timeOutExecutor}
			graphqlClient={graphqlClient}
			changeFunction={changeFunction}
			showMessages={showMessages}
			clearData={clear}/>;
	case selection.roles:
		return <ChangeRoles
			timeOutExecutor={timeOutExecutor}
			graphqlClient={graphqlClient}
			showMessages={showMessages} clearData={clear}/>;
	case selection.insertASell:
		return <SellInput
			timeOutExecutor={timeOutExecutor}
			graphqlClient={graphqlClient}
			changeFunction={changeFunction}
			showMessages={showMessages}
			clearData={clear}/>;
	}
}

export function TimeOutMassage(props: { logout: () => void }) {
	const logout = props.logout;
	return <div className={"TimeOutMassage"}>
		<div className="TimeOutMassage-inner">
			<h2>The session is over.</h2>
			<h2>Please login again.</h2>
			<LoadingButton
				onClick={logout}
				sx={{
					backgroundColor: "#ff9e37",
					fontWeight: "bold",
					color: "#000000",
					"&:hover": {backgroundColor: "#f8ac5b"}
				}}
				variant="contained">
				Reconnect
			</LoadingButton>
		</div>
	</div>;
}