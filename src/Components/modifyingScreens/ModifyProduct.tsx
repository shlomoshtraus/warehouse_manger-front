import React, {Component, FormEvent} from "react";
import {TextField} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import SendIcon from "@mui/icons-material/Send";
import {gql, GraphQLClient} from "graphql-request";
import {messagesInterface, Product} from "../mainScreens/Screen";
import {checkInput, jsonParser} from "../../util/function";


type State = {
	isLoading: boolean,
}
type props = {
	timeOutExecutor: () => void,
	changeFunction: (data: Array<Product>) => void,
	showMessages: (messages: messagesInterface) => void,
	clearData: () => void,
	graphqlClient:GraphQLClient
}

const modProductQuery = gql`
             mutation changePropertiesOfProduct($previousName: String!$name: String,$imgSrc:String,$quantity:Int,$numberOfSales:Int){
			 	changePropertiesOfProduct(previousName:$previousName,name:$name,imgSrc:$imgSrc,quantity:$quantity,numberOfSales:$numberOfSales){
                	name, imgSrc,quantity,numberOfSales
                }
			 }`;

class ModifyProduct extends Component<props, State> {
	constructor(props: props) {
		super(props);
		this.state = {
			isLoading: false,
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
		const oldName: HTMLInputElement = document.querySelector("#nameOfProduct")!;
		const newName: HTMLInputElement = document.querySelector("#newNameOfProduct")!;
		const newNumberOfSales: HTMLInputElement = document.querySelector("#newSellsNumOfProduct")!;
		const newQuantity: HTMLInputElement = document.querySelector("#newQuantityOfProduct")! || undefined;
		const newImgSrc: HTMLInputElement = document.querySelector("#newUrlOfProduct")! || undefined;
		const valid = checkInput([newQuantity.value, newNumberOfSales.value]);
		if (!valid) {
			this.changeLoadingState();
			return showMessages({error: "Quantity and sales number must be a number!"});
		}
		try {
			const data = (await graphqlClient.request( modProductQuery, {
				previousName: oldName.value,
				name: newName.value,
				imgSrc: newImgSrc.value,
				quantity: parseInt(newQuantity.value),
				numberOfSales: parseInt(newNumberOfSales.value)
			})).changePropertiesOfProduct;
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
		return (
			<form onSubmit={this.fetchData.bind(this)} className={"form-container"}>
				<TextField
					required
					autoComplete={"off"}
					id="nameOfProduct"
					label="Name Of The Product"
					variant="filled"/>
				<TextField
					autoComplete={"off"}
					id="newNameOfProduct"
					label="New Name"
					variant="filled"/>
				<TextField
					autoComplete={"off"}
					id="newQuantityOfProduct"
					label="New Quantity"
					variant="filled"/>
				<TextField
					autoComplete={"off"}
					id="newUrlOfProduct"
					label="New Img Url"
					variant="filled"/>
				<TextField
					autoComplete={"off"}
					id="newSellsNumOfProduct"
					label="New Number Of Sales"
					variant="filled"/>
				<LoadingButton
					size="large"
					type={"submit"}
					endIcon={<SendIcon/>}
					loading={this.state.isLoading}
					loadingPosition="end"
					variant="contained">
					Change product property
				</LoadingButton>
			</form>
		);
	}
}

export default ModifyProduct;
