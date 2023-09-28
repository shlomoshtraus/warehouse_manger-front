import React, {Component, FormEvent} from "react";
import {TextField} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import DeleteIcon from "@mui/icons-material/Delete";
import {gql, GraphQLClient} from "graphql-request";
import {messagesInterface, Product} from "../mainScreens/Screen";
import {jsonParser} from "../../util/function";


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

const deleteProductQuery = gql`
             mutation deleteAnProduct($name: String!){
			 	deleteAnProduct(name:$name){
                	name, imgSrc,quantity,numberOfSales
                }
			 }`;

class DeleteProduct extends Component<props, State> {
	constructor(props: props) {
		super(props);
		this.state = {
			isLoading: false,
		};
	}

	changeLoadingState() {
		this.setState(prevState => ({isLoading: !prevState.isLoading}));
	}


	async fetchData(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const {changeFunction, showMessages, clearData,graphqlClient,timeOutExecutor} = this.props;
		const name: HTMLInputElement = document.querySelector("#nameOfProduct")!;
		this.changeLoadingState();
		clearData();
		try {
			const data = (await graphqlClient.request(deleteProductQuery, {
				name: name.value
			})).deleteAnProduct;
			data.name = "-";
			data.quantity = "-";
			data.numberOfSales = "-";
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
				<LoadingButton
					size="large"
					type={"submit"}
					endIcon={<DeleteIcon/>}
					loading={this.state.isLoading}
					loadingPosition="end"
					variant="contained">
					Delete product
				</LoadingButton>
			</form>
		);
	}
}

export default DeleteProduct;
