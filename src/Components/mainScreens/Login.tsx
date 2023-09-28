import React, {Component, FormEvent} from "react";
import "../../styles/login.css";
import {
	gql, GraphQLClient
} from "graphql-request";
import {TextField} from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import LoadingButton from "@mui/lab/LoadingButton";
import {jsonParser} from "../../util/function";


type State = {
	isLoading: boolean,
	massage?: string
}

type props = {
	setToken: (token: string | undefined) => void,
	forgetPasswordChangeState: () => void,
	graphqlClient: GraphQLClient
};

const loginQuery = gql`
          mutation login($email: String!
                          $password: String!){
                login(email:$email
                              password:$password)
          }
        `;

export class Login extends Component<props, State> {
	constructor(props: props) {
		super(props);
		this.state = {
			isLoading: false
		};
	}

	changeLoadingState() {
		this.setState(prevState => ({isLoading: !prevState.isLoading}));
	}


	private async fetchRequest(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		this.setState({massage: undefined});
		const {setToken, graphqlClient} = this.props;
		this.changeLoadingState();
		const email: HTMLInputElement = document.querySelector("#email")!;
		const password: HTMLInputElement = document.querySelector("#password")!;
		try {
			const data = (await graphqlClient.request(loginQuery, {
				email: email.value,
				password: password.value
			})).login;
			setToken(data);
		} catch (e) {
			const text = jsonParser(e as string).response.errors[0].message;
			this.displayMassage(text);
		} finally {
			this.changeLoadingState();
		}
	}

	private displayMassage(text: string) {
		this.setState({massage: text});
		setTimeout(() => {
			this.setState({massage: undefined});
		}, 2500);
	}

	render() {
		const {massage, isLoading} = this.state;
		return <form className="login-container" onSubmit={this.fetchRequest.bind(this)}>
			<h1 className="large-title">Login</h1>
			<TextField
				required
				placeholder="Email"
				className="login-input"
				id="email"
				color="success"
				type="email"
				variant="standard"/>
			<TextField
				required
				color="success"
				placeholder="Password"
				className="login-input"
				autoComplete="on"
				id="password"
				type="password"
				variant="standard"/>
			<div className="login-forget-container">
				<LoadingButton
					disableElevation
					variant="contained"
					id="login-submit"
					loading={isLoading}
					color="success"
					size="large"
					endIcon={<LoginIcon/>}
					type="submit">Sign
					in
				</LoadingButton>
				<a href="#" id="linksLabel" onClick={this.props.forgetPasswordChangeState}>Forget
					Password?</a>
			</div>
			{massage && <h3>{massage}</h3>}
		</form>;
	}

}