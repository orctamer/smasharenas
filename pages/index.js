import React from 'react'
import io from 'socket.io-client'
import {parseCookies} from 'nookies'
import fetch from 'isomorphic-fetch'


export default class extends React.Component {
  constructor(props) {
    super(props)
  }
  static async getInitialProps(ctx) {
    const {authorization} = parseCookies(ctx)
    const {token} = ctx.query
    async function getUser() {
      const res = await fetch("http://localhost:3000/user", {
				headers: { authorization },
      });
			if (res.status === 200) return { authorization, user: res.data };
			else return { authorization };
    }
    return {
			authorization: getUser(authorization || token)
		};
  }
  componentDidMount() {
    this.socket = io()
  }
  render() {
    return (
			<>
      {JSON.stringify(this.props)}
				{this.props.authorization && (
					<a href={"http://localhost:3000/auth"}>Login to Twitch</a>
				)}
			</>
		);
  }
}