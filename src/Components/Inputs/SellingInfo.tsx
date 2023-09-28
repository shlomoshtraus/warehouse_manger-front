import React, {Component, FormEvent} from "react";
import {Button, FormControlLabel, Radio, RadioGroup, Slider} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import SendIcon from "@mui/icons-material/Send";
import {gql, GraphQLClient} from "graphql-request";
import "../../styles/SellingInfo.css";
import {messagesInterface, Product} from "../mainScreens/Screen";
import {jsonParser} from "../../util/function";
import {utils, writeFile} from "xlsx";
import FileDownloadIcon from "@mui/icons-material/FileDownload";


type State = {
	isLoading: boolean,
	data: boolean,
	limitValue: number,
	choice: string
}
type props = {
	timeOutExecutor: () => void
	changeFunction: (data: Array<Product>) => void,
	showMessages: (messages: messagesInterface) => void,
	clearData: () => void,
	graphqlClient: GraphQLClient
}

const worstListQuery = gql`
					query worstSellingProducts($limit: Int!){
                			worstSellingProducts(limit:$limit){
                				name, imgSrc,quantity,numberOfSales
                			}
        			 }`;
const bestListQuery = gql`
					query bestSellingProducts($limit: Int!){
                			bestSellingProducts(limit:$limit){
                				name, imgSrc,quantity,numberOfSales
                			}
        			 }`;

class SellingInfo extends Component<props, State> {

	constructor(props: props) {
		super(props);
		this.state = {
			isLoading: false,
			data: false,
			limitValue: 5,
			choice: "best"
		};

	}

	changeLoadingState() {
		this.setState(prevState => ({isLoading: !prevState.isLoading}));
	}

	async exportToExcel() {
		let data = await this.fetchData();
		data = data.map((product: Product) => {
			return {
				"Name of product": product.name,
				"Quantity": product.quantity,
				"Number of Sales": product.numberOfSales,
				"Image url": product.imgSrc
			};
		});
		const sheet = utils.json_to_sheet(data);
		const book = utils.book_new();
		utils.book_append_sheet(book, sheet, "Selling Info");
		writeFile(book, "Products.xlsx");
	}

	async getList(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const {changeFunction} = this.props;
		(document.querySelector(".data-container") as HTMLDivElement)!.style.display = "none";
		this.changeLoadingState();
		const data = await this.fetchData();
		this.changeLoadingState();
		changeFunction(data);
	}

	async fetchData() {
		const {limitValue, choice} = this.state;
		const variables = {limit: limitValue};
		let data;
		const {
			showMessages,
			graphqlClient,
			timeOutExecutor
		} = this.props;
		try {
			if (choice === "best") {
				data = (await graphqlClient.request(bestListQuery, variables)).bestSellingProducts;
			} else if (choice === "worst") {
				data = (await graphqlClient.request(worstListQuery, variables)).worstSellingProducts;
			}
			return data;
		} catch (e) {
			const errorFormatted = jsonParser(e as string);
			if (errorFormatted.response.status === 403) {
				timeOutExecutor();
			} else {
				const error = errorFormatted.response.errors[0].message;
				showMessages({error});
			}
		}
	}

	setChoice(event: React.MouseEvent<HTMLLabelElement>) {
		const choice = (event.target as HTMLInputElement).value;
		this.setState({choice});
	}

	setLimit(event: Event, limitValue: number | number[]) {
		if (typeof limitValue === "number") {
			this.setState({limitValue});
		}
	}

	render() {
		const isLoading = this.state.isLoading;
		return (
			<form onSubmit={this.getList.bind(this)} className="LoadingButtonsContainer">
				<h1>Sale Information</h1>
				<RadioGroup
					defaultValue="best"
					name="radio-buttons-group">
					<FormControlLabel
						className={"listOptionButton"}
						value="best"
						control={<Radio/>}
						label={<span className={"boldText"}>Best</span>}
						onClick={this.setChoice.bind(this)}/>
					<FormControlLabel
						className={"listOptionButton"}
						value="worst"
						control={<Radio/>}
						label={<span className={"boldText"}>Worst</span>}
						onClick={this.setChoice.bind(this)}/>
				</RadioGroup>
				<span className={"boldText"}>
						Limit result by: {this.state.limitValue}
				</span>
				<Slider
					id="limitSlider"
					defaultValue={5}
					valueLabelDisplay="on"
					step={1}
					onChange={this.setLimit.bind(this)}
					min={5}
					max={30}
				/>
				<LoadingButton
					size="large"
					type={"submit"}
					endIcon={<SendIcon/>}
					loading={isLoading}
					loadingPosition="end"
					variant="contained">
					Get sales info
				</LoadingButton>
				<Button
					endIcon={<FileDownloadIcon/>}
					sx={{
						color: "rgb(3,117,67)",
						fontWeight: "bold",
					}}
					variant="outlined"
					color="success"
					onClick={this.exportToExcel.bind(this)}>
					Export to Excel
				</Button>
			</form>
		);
	}
}

export default SellingInfo;