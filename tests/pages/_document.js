import Document, { Html, Head, Main, NextScript } from 'next/document'

class AppDocument extends Document {
  // static async getInitialProps(ctx) {
  //   const initialProps = await Document.getInitialProps(ctx)
  //   return { ...initialProps }
  // }
  render() {
    return (
      <Html>
        <Head>
          <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;500&display=swap" rel="stylesheet" />
          <script src="https://cdn.jsdelivr.net/npm/@dv4all/icons@1.0.2/lib/dv4icons.cjs.min.js"></script>
          <script src="https://cdn.jsdelivr.net/npm/@dv4all/loaders@1.0.1/lib/dv4loaders.cjs.min.js"></script>
          <link rel="shortcut icon" href="/favicon4.png" type="image/x-icon"/>
          <link rel="stylesheet" href="/index.css" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default AppDocument