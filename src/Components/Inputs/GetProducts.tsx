import React, {Component, FormEvent} from "react";
import {FormControlLabel, Radio, RadioGroup, TextField} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import SendIcon from "@mui/icons-material/Send";
import {gql, GraphQLClient} from "graphql-request";
import {messagesInterface, Product} from "../mainScreens/Screen";
import {jsonParser} from "../../util/function";

type State = {
	isLoading: boolean,
	value: string
}
type props = {
	role: string,
	timeOutExecutor: () => void
	changeFunction: (data: Array<Product>) => void,
	showMessages: (messages: messagesInterface) => void,
	clearData: () => void,
	graphqlClient: GraphQLClient
}
const getProductsMangerQuery = gql`
					{
						getAllProducts{
						name, imgSrc,quantity,numberOfSales
						}
					}`;
const getProductMangerQuery = gql`
             query searchForProducts($name: String!){
                searchForProducts(name:$name){
                name, imgSrc,quantity,numberOfSales
                }
         		 }`;
const getProductsClientWorkerQuery = gql`
					{
						getAllProducts{
						name, imgSrc,quantity
						}
					}`;
const getProductClientWorkerQuery = gql`
             query searchForProducts($name: String!){
                searchForProducts(name:$name){
                name, imgSrc,quantity
                }
         		 }`;

class GetProducts extends Component<props, State> {
	constructor(props: props) {
		super(props);
		this.state = {
			isLoading: false,
			value: "one"
		};

	}

	changeLoadingState() {
		this.setState(prevState => ({isLoading: !prevState.isLoading}));
	}

	async getAllProducts() {
		const {
			changeFunction,
			showMessages,
			clearData,
			graphqlClient,
			timeOutExecutor,
			role
		} = this.props;
		this.changeLoadingState();
		clearData();
		try {
			const isManger = role === "Manger";
			const query = isManger ? getProductsMangerQuery : getProductsClientWorkerQuery;
			const data = (await graphqlClient.request(query)).getAllProducts;
			changeFunction(data);
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

	async searchForProducts() {
		const {
			changeFunction,
			showMessages,
			clearData,
			graphqlClient,
			timeOutExecutor,
			role
		} = this.props;
		this.changeLoadingState();
		const nameOfProduct: HTMLInputElement = document.querySelector("#nameOfProduct")!;
		clearData();
		try {
			const isManger = role === "Manger";
			const query = isManger ? getProductMangerQuery : getProductClientWorkerQuery;
			const data = (await graphqlClient.request(query, {
				name: nameOfProduct.value
			}));
			changeFunction(data.searchForProducts);
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

	async fetchData(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const {value} = this.state;
		if (value == "one") await this.searchForProducts();
		if (value == "all") await this.getAllProducts();
	}

	optionsClickHandler(event: React.MouseEvent<HTMLLabelElement>) {
		const value = (event.target as HTMLInputElement).value;
		this.setState({value});
		const nameOfProduct: HTMLInputElement = document.querySelector("#nameOfProduct")!;
		nameOfProduct.disabled = value === "all";
		nameOfProduct.value = "";
	}

	render() {
		const isClicked = this.state.isLoading;
		return (
			<form onSubmit={this.fetchData.bind(this)} className="LoadingButtonsContainer">
				<h1>Get Products</h1>
				<RadioGroup
					id="optionChoice"
					defaultValue="one"
					name="radio-buttons-group">
					<FormControlLabel
						value="one"
						control={<Radio/>}
						label={<span className={"boldText"}>Search By Value</span>}
						onClick={this.optionsClickHandler.bind(this)}/>
					<FormControlLabel
						onClick={this.optionsClickHandler.bind(this)}
						value="all"
						control={<Radio/>}
						label={<span className={"boldText"}>Get
							All</span>}/>
				</RadioGroup>
				<TextField
					autoComplete={"off"}
					id="nameOfProduct"
					required={true}
					label="Name Of The Product"
					variant="filled"/>
				<LoadingButton
					type={"submit"}
					size="large"
					endIcon={<SendIcon/>}
					loading={isClicked}
					loadingPosition="end"
					variant="contained">
					Search Product
				</LoadingButton>
			</form>
		);
	}
}

export default GetProducts;