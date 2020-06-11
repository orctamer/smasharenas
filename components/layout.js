import react from 'react'
import Head from 'next/head'

export default class extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <>
      <Head>
        <title>Smash Arenas</title>
        <link rel="stylesheet" href="https://unpkg.com/purecss@2.0.3/build/pure-min.css" integrity="sha384-cg6SkqEOCV1NbJoCu11+bm0NvBRc8IYLRGXkmNrqUBfTjmMYwNKPWBTIKyw9mHNJ" crossorigin="anonymous" />
      </Head>
      {this.props.children}
      </>
    )
  }
}