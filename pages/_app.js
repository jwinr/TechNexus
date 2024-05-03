import Layout from "../layouts/layout"
import React from "react"
import { Helmet, HelmetProvider } from "react-helmet-async"
import "../styles/globals.css"
import { Amplify } from "aws-amplify"
import amplifyconfig from "../src/amplifyconfiguration.json"
Amplify.configure(amplifyconfig)
import { ContextProviderComponent } from "../context/mainContext"
import { MobileViewProvider } from "../components/common/MobileViewDetector"

function TechNexus({ Component, pageProps, categories }) {
  return (
    <React.StrictMode>
      <MobileViewProvider>
        <ContextProviderComponent>
          <HelmetProvider>
            <Helmet>
              <html lang="en" />
              <link
                rel="preconnect"
                href="https://fonts.googleapis.com"
                crossorigin
              />
            </Helmet>

            <Layout categories={categories}>
              <Component {...pageProps} />
            </Layout>
          </HelmetProvider>
        </ContextProviderComponent>
      </MobileViewProvider>
    </React.StrictMode>
  )
}

export default TechNexus
