import React, {Component, FormEvent} from "react";
import {
	FormControl,
	MenuItem,
	Select, SelectChangeEvent,
	TextField
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import SendIcon from "@mui/icons-material/Send";
import {gql, GraphQLClient} from "graphql-request";
import "../../styles/ChangeRoles.css";
import {messagesInterface} from "../mainScreens/Screen";
import {jsonParser} from "../../util/function";

type State = {
	isLoading: boolean,
	roleChange: string
}

type props = {
	timeOutExecutor: () => void
	showMessages: (messages: messagesInterface) => void,
	clearData: () => void,
	graphqlClient: GraphQLClient
}

const changeRoleQuery = gql`
             mutation changeRole($email: String!,$role: String!){
                changeRole(email:$email,reqRole:$role){
                username,role
                }
         		 }`;

class ChangeRoles extends Component<props, State> {

	constructor(props: props) {
		super(props);
		this.state = {
			isLoading: false,
			roleChange: "client"
		};

	}

	changeLoadingState() {
		this.setState(prevState => ({isLoading: !prevState.isLoading}));
	}

	async fetchData(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const {showMessages, clearData, graphqlClient, timeOutExecutor} = this.props;
		const email: HTMLInputElement = document.querySelector("#EmailOfUser")!;
		const role = this.state.roleChange;
		this.changeLoadingState();
		clearData();
		try {
			const data = (await graphqlClient.request(changeRoleQuery, {
				email: email.value,
				role
			})).changeRole;
			const message = `The role "${data.role}" is now assign to ${data.username}`;
			showMessages({message});
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

	roleChangeHandler(e: SelectChangeEvent) {
		this.setState({roleChange: e.target.value});
	}

	render() {
		const isClicked = this.state.isLoading;
		return (
			<form onSubmit={this.fetchData.bind(this)} className="LoadingButtonsContainer">
				<h1>Assign Role For User</h1>
				<div className={"roleInputContainer"}>
					<TextField
						required
						autoComplete={"off"}
						id="EmailOfUser"
						label="Email Of User"
						type="email"
						variant="filled"/>
					<FormControl sx={{m: 2, minWidth: 120}}>
						<Select
							required
							onChange={this.roleChangeHandler.bind(this)}
							displayEmpty>
							<MenuItem value={"Client"}>Client</MenuItem>
							<MenuItem value={"Worker"}>Worker</MenuItem>
							<MenuItem value={"Manger"}>Manger</MenuItem>
						</Select>
					</FormControl>
				</div>
				<LoadingButton
					size="large"
					type={"submit"}
					endIcon={<SendIcon/>}
					loading={isClicked}
					loadingPosition="end"
					variant="contained">
					Send Request
				</LoadingButton>
			</form>
		);
	}
}

export default ChangeRoles;