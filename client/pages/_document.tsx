import * as React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet, injectGlobal } from 'styled-components';
import { JssProvider } from 'react-jss';
import getContext from '../lib/mui-get-context';

// Global styles
// tslint:disable-next-line
injectGlobal`
  body {
    font-family: Roboto;
  }
  a {
    text-decoration: none;
    color: #1fe8af !important;
    cursor: pointer;
  }
  b {
    font-weight: 700;
  }
  button {
    cursor: pointer;
  }
`;

export default class MyDocument extends Document {
  public static async getInitialProps(ctx) {
    const context = getContext();
    const page = ctx.renderPage(Component => props => (
      <JssProvider registry={context.sheetsRegistry} jss={context.jss}>
        <Component {...props} />
      </JssProvider>
    ));
    
    return {
      ...page,
      stylesContext: context,
      styles: (
        <style
          id="jss-server-side"
          dangerouslySetInnerHTML={{ __html: context.sheetsRegistry.toString() }}
        />
      ),
    };
  }

  public render() {
    const sheet = new ServerStyleSheet();
    const main = sheet.collectStyles(<Main />);
    const styleTags = sheet.getStyleElement();
    return (
      <html lang="en">
        <Head>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"
          />
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/meyer-reset/2.0/reset.min.css"
          />
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/2.6.0/github-markdown.min.css"
          />
          <script src="https://cdn.auth0.com/js/lock/10.5/lock.min.js" />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/static/favicon/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="96x96"
            href="/static/favicon/favicon-96x96.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/static/favicon/favicon-16x16.png"
          />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Octon</title>
          <meta
            name="description"
            content="Any new releases on your starred projects ? Octon will let you know."
          />
          {styleTags}
        </Head>
        <body>
          <div className="root">{main}</div>
          <NextScript />
        </body>
      </html>
    );
  }
}
