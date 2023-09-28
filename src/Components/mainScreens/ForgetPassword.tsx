import React, {Component, FormEvent} from "react";
import {gql, GraphQLClient} from "graphql-request";
import "../../styles/forgetPassword.css";
import {TextField} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import LockResetIcon from "@mui/icons-material/LockReset";
import {jsonParser} from "../../util/function";


type State = {
	isLoading: boolean,
	massage?: string
}

type props = {
	forgetPasswordChangeState: () => void,
	graphqlClient: GraphQLClient
};

const resetPasswordQuery = gql`
          mutation requestPasswordLink($email: String!){
                requestPasswordLink(email:$email)
                
          }
        `;

export class ForgetPassword extends Component<props, State> {
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
		let text;
		this.setState({massage: undefined});
		const {graphqlClient} = this.props;
		this.changeLoadingState();
		const email: HTMLInputElement = document.querySelector("#email")!;
		try {
			text = (await graphqlClient.request(resetPasswordQuery, {
				email: email.value
			})).requestPasswordLink;
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

	render() {
		const {massage, isLoading} = this.state;
		return (
			<form className="forPass-container" onSubmit={this.fetchRequest.bind(this)}>
				<h1 className="small-title">Forget your password?</h1>
				<TextField
					required
					placeholder="Email"
					className="forPass-input"
					id="email"
					color="success"
					type="text"
					variant="standard"/>
				<div className="login-forget-container">
					<LoadingButton
						disableElevation
						variant="contained"
						id="forPass-submit"
						loading={isLoading}
						color="success"
						size="large"
						endIcon={<LockResetIcon />}
						type="submit">send reset link
					</LoadingButton>
					<a
						href="#"
						id="linksLabel"
						onClick={this.props.forgetPasswordChangeState}>
						Login page?
					</a>
				</div>
				{massage && <h3>{massage}</h3>}
			</form>
		);
	}
}