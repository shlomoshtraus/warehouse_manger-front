import React, {Component, FormEvent} from "react";
import {TextField} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import SendIcon from "@mui/icons-material/Send";
import {gql, GraphQLClient} from "graphql-request";
import {messagesInterface, Product} from "../mainScreens/Screen";
import {checkInput, jsonParser} from "../../util/function";


type State = {
	isLoading: boolean,
	data: boolean
}
type props = {
	timeOutExecutor: () => void
	changeFunction: (data: Array<Product>) => void,
	showMessages: (messages: messagesInterface) => void,
	clearData: () => void,
	graphqlClient:GraphQLClient
}
const addASellQuery = gql`
             	mutation makeASell($name: String!,$number:Int!){
                	makeASell(nameOfProduct:$name,numberOfItemsSold: $number){
                		name, imgSrc,quantity,numberOfSales
                	}
         		}`;

class SellInput extends Component<props, State> {

	constructor(props: props) {
		super(props);
		this.state = {
			isLoading: false,
			data: false
		};
	}

	private changeLoadingState() {
		this.setState(prevState => ({isLoading: !prevState.isLoading}));
	}

	private async fetchData(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		this.changeLoadingState();
		const {changeFunction, showMessages, clearData,graphqlClient,timeOutExecutor} = this.props;
		clearData();
		const nameOfProduct: HTMLInputElement = document.querySelector("#nameOfProduct")!;
		const numberOfItemsSold: HTMLInputElement = document.querySelector("#quantity")!;
		const valid = checkInput([numberOfItemsSold.value]);
		if (!valid) {
			this.changeLoadingState();
			return showMessages({error: "Quantity must be a number!"});
		}
		const quantity = parseInt(numberOfItemsSold.value);
		try {
			const data = (await graphqlClient.request( addASellQuery, {
				name: nameOfProduct.value,
				number: quantity
			})).makeASell;
			changeFunction([data]);
		} catch (e) {
			const errorFormatted = jsonParser(e as string);
			if (errorFormatted.response.status === 403) {
				timeOutExecutor();
			} else {
				const error = errorFormatted.response.errors[0].message;
				showMessages({error});
			}
		} finally {
			this.changeLoadingState();
		}
	}

	render() {
		const isLoading = this.state.isLoading;
		return (
			<form onSubmit={this.fetchData.bind(this)} className="LoadingButtonsContainer">
				<h1>Insert A Sell</h1>
				<TextField
					required
					autoComplete={"off"}
					className="workerTextField"
					id="nameOfProduct"
					label="Name Of The Product"
					variant="filled"/>
				<TextField
					required
					autoComplete={"off"}
					className="workerTextField"
					id="quantity"
					label="Quantity"
					variant="filled"/>
				<LoadingButton
					size="large"
					type={"submit"}
					endIcon={<SendIcon/>}
					loading={isLoading}
					loadingPosition="end"
					variant="contained"
				>Enter A Sell
				</LoadingButton>
			</form>
		);
	}


}

export default SellInput;