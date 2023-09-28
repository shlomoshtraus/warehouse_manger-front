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

const addProductQuery = gql`
             mutation addAnProduct($name: String!,$imgSrc:String!,$quantity:Int!){
			 	addAnProduct(name:$name,imgSrc:$imgSrc,quantity:$quantity){
                	name, imgSrc,quantity
                }
			 }`;

class AddProduct extends Component<props, State> {
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
		const name: HTMLInputElement = document.querySelector("#nameOfProduct")!;
		const quantity: HTMLInputElement = document.querySelector("#quantityOfProduct")!;
		const imgSrc: HTMLInputElement = document.querySelector("#imgUrlOfProduct")!;
		const valid = checkInput([quantity.value]);
		if (!valid) {
			this.changeLoadingState();
			return showMessages({error: "Quantity must be a number!"});
		}
		try {
			const data = (await graphqlClient.request(addProductQuery , {
				name: name.value,
				imgSrc: imgSrc.value,
				quantity: parseInt(quantity.value)
			})).addAnProduct;
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
					required={true}
					autoComplete={"off"}
					id="nameOfProduct"
					label="Name Of The Product"
					variant="filled"/>
				<TextField
					required={true}
					autoComplete={"off"}
					id="imgUrlOfProduct"
					label="Img Url"
					variant="filled"/>
				<TextField
					required={true}
					autoComplete={"off"}
					id="quantityOfProduct"
					label="Quantity"
					variant="filled"/>
				<LoadingButton
					type={"submit"}
					size="large"
					endIcon={<SendIcon/>}
					loading={this.state.isLoading}
					loadingPosition="end"
					variant="contained">
					Add product
				</LoadingButton>
			</form>
		);
	}
}

export default AddProduct;
