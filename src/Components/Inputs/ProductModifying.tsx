import React, {Component} from "react";
import {FormControlLabel, Radio, RadioGroup} from "@mui/material";
import AddProduct from "../modifyingScreens/AddProduct";
import DeleteProduct from "../modifyingScreens/DeleteProduct";
import ModifyProduct from "../modifyingScreens/ModifyProduct";
import {messagesInterface, Product} from "../mainScreens/Screen";
import {GraphQLClient} from "graphql-request";


type State = {
	addMode: boolean,
	changeMode: boolean,
	deleteMode: boolean,
}

type props = {
	timeOutExecutor: () => void
	changeFunction: (data: Array<Product>) => void,
	showMessages: (messages: messagesInterface) => void,
	clearData: () => void,
	graphqlClient:GraphQLClient
}


class ProductModifying extends Component<props, State> {

	constructor(props: props) {
		super(props);
		this.state = {
			addMode: true,
			changeMode: false,
			deleteMode: false
		};

	}


	optionsClickHandler(event: React.MouseEvent<HTMLLabelElement>) {
		const option = (event.target as HTMLInputElement).value;
		switch (option) {
		case "add":
			this.setState({addMode: true, changeMode: false, deleteMode: false});
			break;
		case "change":
			this.setState({addMode: false, changeMode: true, deleteMode: false});
			break;
		case "delete":
			this.setState({addMode: false, changeMode: false, deleteMode: true});
			break;
		}
	}


	render() {
		const {addMode, changeMode, deleteMode} = this.state;
		const {changeFunction,showMessages,clearData,graphqlClient,timeOutExecutor} = this.props;
		return (
			<>
				<div className="LoadingButtonsContainer">
					<h1>Product Modifying</h1>
					<RadioGroup
						defaultValue="add"
						name="radio-buttons-group"
						row>
						<FormControlLabel
							className="options"
							value="add"
							control={<Radio/>}
							label={<span className={"boldText"}>Add</span>}
							labelPlacement="top"
							onClick={this.optionsClickHandler.bind(this)}/>
						<FormControlLabel
							className="options"
							value="change"
							control={<Radio/>}
							label={<span className={"boldText"}>Change Props</span>}
							labelPlacement="top"
							onClick={this.optionsClickHandler.bind(this)}/>
						<FormControlLabel
							className="options"
							onClick={this.optionsClickHandler.bind(this)}
							value="delete"
							control={<Radio/>}
							label={<span className={"boldText"}>Delete</span>}
							labelPlacement="top"/>
					</RadioGroup>
					{addMode && <AddProduct timeOutExecutor={timeOutExecutor} graphqlClient={graphqlClient} changeFunction={changeFunction.bind(this)} showMessages ={showMessages.bind(this)} clearData={clearData.bind(this)}/>}
					{deleteMode && <DeleteProduct timeOutExecutor={timeOutExecutor} graphqlClient={graphqlClient} changeFunction={changeFunction.bind(this)} showMessages ={showMessages.bind(this)} clearData={clearData.bind(this)}/>}
					{changeMode && <ModifyProduct timeOutExecutor={timeOutExecutor} graphqlClient={graphqlClient} changeFunction={changeFunction.bind(this)} showMessages ={showMessages.bind(this)} clearData={clearData.bind(this)}/>}
				</div>
			</>
		);
	}
}

export default ProductModifying;