import {GraphQLClient} from "graphql-request";
import React from "react";
import "../../styles/loginRegisterScreen.css";
import {Login} from "./Login";
import Register from "./Register";
import {createGraphqlClient} from "../../util/function";
import {ForgetPassword} from "./ForgetPassword";

type MyState = {
	isLogin: boolean,
	graphqlClient: GraphQLClient,
	isForgetPassword: boolean
}
type props = {
	setToken: (token: string | undefined) => void
}

class LoginRegisterScreen extends React.Component<props, MyState> {

	constructor(props: props) {
		const graphqlClient = createGraphqlClient();
		super(props);
		this.state = {isLogin: true, graphqlClient, isForgetPassword: false};
	}

	private registerHandler() {
		this.setState(prevState => ({isLogin: !prevState.isLogin, isForgetPassword: false}));
	}

	forgetPasswordChangeState() {
		this.setState(prevState => ({isForgetPassword: !prevState.isForgetPassword}));
	}

	render() {
		const {isLogin, graphqlClient, isForgetPassword} = this.state;
		const {setToken} = this.props;
		const currentForm = isLogin ? "Register" : "Login";

		let currentScreen;
		if (!isLogin) {
			currentScreen = < Register
				graphqlClient={graphqlClient}
				changeState={this.registerHandler.bind(this)}/>;
		} else if (isForgetPassword) {
			currentScreen = <ForgetPassword
				forgetPasswordChangeState={this.forgetPasswordChangeState.bind(this)}
				graphqlClient={graphqlClient}/>;
		} else {
			currentScreen = <Login
				graphqlClient={graphqlClient}
				setToken={setToken}
				forgetPasswordChangeState={this.forgetPasswordChangeState.bind(this)}/>;
		}

		return <div className="app-container">
			{currentScreen}
			<a
				href="#"
				id="linkText"
				onClick={this.registerHandler.bind(this)}>{currentForm}</a>
		</div>;
	}
}

export default LoginRegisterScreen;
