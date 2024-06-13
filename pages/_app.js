import Layout from "../layouts/layout"
import React from "react"
import { Manrope } from "next/font/google"
import "../styles/globals.css"
import { Amplify } from "aws-amplify"
import amplifyconfig from "../src/amplifyconfiguration.json"
Amplify.configure(amplifyconfig)
import { ContextProviderComponent } from "../context/mainContext"
import { MobileViewProvider } from "../utils/MobileViewDetector"
import { UserProvider } from "../context/UserContext"
import ErrorBoundary from "../components/common/ErrorBoundary"

const manrope = Manrope({ subsets: ["latin"] })

function TechNexus({ Component, pageProps, categories }) {
  return (
    <>
      <style jsx global>{`
        html {
          font-family: ${manrope.style.fontFamily};
        }
      `}</style>
      <React.StrictMode>
        <MobileViewProvider>
          <UserProvider>
            <ContextProviderComponent>
              <ErrorBoundary>
                <Layout categories={categories}>
                  <Component {...pageProps} />
                </Layout>
              </ErrorBoundary>
            </ContextProviderComponent>
          </UserProvider>
        </MobileViewProvider>
      </React.StrictMode>
    </>
  )
}

export default TechNexus
