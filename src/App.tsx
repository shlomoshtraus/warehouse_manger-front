import React from "react";
import Screen from "./Components/mainScreens/Screen";
import "./styles/app.css";
import LoginRegisterScreen from "./Components/mainScreens/LoginRegisterScreen";
import {Route, Routes, useParams} from "react-router-dom";
import {ResetPassword} from "./Components/mainScreens/ResetPassword";
import {PageNotFound} from "./Components/mainScreens/PageNotFound";

type MyState = { token?: string };

const PassPramsWorkAround = () => {
	const {id} = useParams();
	const result = RegExp(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i)
		.test(id as string);
	if (result) return <ResetPassword id={id}/>;
	return <PageNotFound/>;

};

class App extends React.Component<Record<string, never>, MyState> {

	constructor(props: Record<string, never>) {
		super(props);
		this.state = {
			token: undefined
		};
	}

	private setToken(token: string | undefined) {
		this.setState({token});
	}


	render() {
		const {token} = this.state;
		return <>
			<div id="logo">
				<img src="https://www.logodesign.net/logo/line-art-house-roof-and-buildings-4485ld.png" alt="logo"/>
			</div>
			<div id="app-div">
				<Routes>
					<Route path="/" element={token ?
						<Screen setToken={this.setToken.bind(this)} token={token}/> :
						<LoginRegisterScreen setToken={this.setToken.bind(this)}/>}/>
					<Route path="/reset/:id" element={<PassPramsWorkAround/>}/>
					<Route path="*" element={<PageNotFound/>}/>
				</Routes>
			</div>
		</>;
	}
}

export default App;
