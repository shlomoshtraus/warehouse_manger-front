import React, {ChangeEvent, Component} from "react";
import {gql, GraphQLClient} from "graphql-request";
import "../../styles/forgetPassword.css";
import {TextField} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import {createGraphqlClient, jsonParser} from "../../util/function";
import SyncLockIcon from "@mui/icons-material/SyncLock";
import {Navigate} from "react-router-dom";

type State = {
	isLoading: boolean,
	massage?: string,
	password: string,
	navigate: boolean,
	repeatPassword: string,
	graphqlClient: GraphQLClient
}

type props = {
	id: string | undefined
};

const resetUserPasswordQuery = gql`
          mutation resetUserPassword($userId: String!, $password: String!){
                resetUserPassword(userId:$userId, password:$password)
                
          }
        `;

export class ResetPassword extends Component<props, State> {
	constructor(props: props) {
		const graphqlClient = createGraphqlClient();
		super(props);
		this.state = {
			isLoading: false,
			navigate: false,
			graphqlClient,
			password: "",
			repeatPassword: ""
		};
	}

	changeLoadingState() {
		this.setState(prevState => ({isLoading: !prevState.isLoading}));
	}

	private async fetchRequest(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		let text;
		this.setState({massage: undefined});
		const {password, repeatPassword, graphqlClient} = this.state;
		const {id} = this.props;
		if (repeatPassword !== password) {
			return this.setState({massage: "Enter the same password"});
		}
		this.changeLoadingState();
		try {
			text = (await graphqlClient.request(resetUserPasswordQuery, {
				userId: id,
				password
			})).resetUserPassword;
			setTimeout(()=>this.setState({navigate:true}),1000);
		} catch (e) {
			text = jsonParser(e as string).response.errors[0].message;
		} finally {
			this.displayMassage(text);
			this.changeLoadingState();
		}
	}

	private displayMassage(text: string) {
		this.setState({massage: text});
		setTimeout(() => {
			this.setState({massage: undefined});
		}, 2500);
	}

	private passwordUpdate(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
		const password = event.target.value;
		this.setState({password});
	}

	private repeatPasswordUpdate(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
		const repeatPassword = event.target.value;
		this.setState({repeatPassword});
	}

	render() {
		const {massage, password, repeatPassword, isLoading} = this.state;
		const { navigate } = this.state;
		if (navigate) {
			return <Navigate to="/"/>;
		}
		return (
			<div className="app-container">
				<form className="forPass-container" onSubmit={this.fetchRequest.bind(this)}>
					<h1 className="forPass-title">Reset your password</h1>
					<TextField
						required
						size="medium"
						color="success"
						onChange={this.passwordUpdate.bind(this)}
						placeholder="Password"
						id="password"
						type="password"
						autoComplete={"on"}
						variant="standard"/>
					<TextField
						required
						color="success"
						placeholder="Repeat the Password"
						id="RepeatPassword"
						onChange={this.repeatPasswordUpdate.bind(this)}
						error={password !== repeatPassword}
						type="password"
						autoComplete={"on"}
						variant="standard"/>
					<LoadingButton
						disableElevation
						variant="contained"
						loading={isLoading}
						color="success"
						size="medium"
						endIcon={<SyncLockIcon/>}
						type="submit">change password
					</LoadingButton>
					{massage && <h3>{massage}</h3>}
				</form>
			</div>);
	}
}
