import Layout from "../layouts/layout"
import React from "react"
import localFont from "next/font/local"
import "../styles/globals.css"
import { Amplify } from "aws-amplify"
import amplifyconfig from "../src/amplifyconfiguration.json"
Amplify.configure(amplifyconfig)
import { MobileViewProvider } from "../utils/MobileViewDetector"
import { UserProvider } from "../context/UserContext"
import { CartProvider } from "../context/CartContext"
import ErrorBoundary from "../components/common/ErrorBoundary"

const SFPro = localFont({ src: "../public/fonts/SF-Pro.ttf" })

function TechNexus({ Component, pageProps, categories }) {
  return (
    <>
      <main className={SFPro.className}>
        <React.StrictMode>
          <MobileViewProvider>
            <UserProvider>
              <CartProvider>
                <ErrorBoundary>
                  <Layout categories={categories}>
                    <Component {...pageProps} />
                  </Layout>
                </ErrorBoundary>
              </CartProvider>
            </UserProvider>
          </MobileViewProvider>
        </React.StrictMode>
      </main>
    </>
  )
}

export default TechNexus
