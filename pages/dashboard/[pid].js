import React from 'react'
import io from "socket.io-client";
import chars from '../../charList.json'
import Layout from '../../components/layout';

export default class extends React.Component {
  constructor(props) {
		super(props);
    this.state = {
			messages: {},
      value: "",
      character: "Mario"
		};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChars = this.handleChars.bind(this);
  }
  handleChange(event) {
    this.setState({
      value: event.target.value
    })
  }
  handleChars(event) {
    this.setState({
      character: event.target.value
    })
  }
  handleSubmit(event) {
    event.preventDefault();
    this.socket.emit('hello', {
      name: this.state.value,
      character: this.state.character
    })
    this.setState({
      value: '',
      character: "Mario"
    })
  }

  componentDidMount(){
    this.socket = io();
    this.socket.on('chat', data => {
      this.setState({
        messages: data.messages
      })
    })
  }
  render() {
      return (
				<Layout>
					<h1 style={{textTransform: "capitalize", fontVariant: "small-caps"}}> - Dashboard</h1>
					<table className="pure-table">
						<thead>
							<tr>
								<th>#</th>
								<th>User</th>
								<th>Character</th>
								<th>Icon</th>
							</tr>
						</thead>
						{Object.values(this.state.messages).map((message, index) => (
							<tbody>
								<tr class={index % 2 == 0 ? "" : "pure-table-odd"}>
									<td>{index + 1}</td>
									<td>{message.name}</td>
									<td>{message.character}</td>
									<td style={{ textAlign: "center" }}>
										<img
											width="50px"
											src={
												"../" +
												chars.fighters.find((x) => x.name == message.character)
													.image
											}
										/>
									</td>
								</tr>
							</tbody>
						))}
					</table>
					<form
						className="pure-form pure-form-stacked"
						onSubmit={this.handleSubmit}
					>
						<label>
							Name:{" "}
							<input
								type="text"
								value={this.state.value}
								onChange={this.handleChange}
							/>
						</label>
						<br />
						<label>
							Choose a Character:
							<select value={this.state.character} onChange={this.handleChars}>
								{chars.fighters.map((char, index) => (
									<option key={index} value={char.name}>
										{char.name}
									</option>
								))}
							</select>
						</label>
						<br />
						<input
							className="pure-button pure-button-primary"
							type="submit"
							value="Submit"
						/>
					</form>
				</Layout>
			);
  }
}