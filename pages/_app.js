import React from "react"
import Layout from "../layout/Layout"
import localFont from "next/font/local"
import "../assets/main.css"
import { Amplify } from "aws-amplify"
import amplifyconfig from "../src/amplifyconfiguration.json"
Amplify.configure(amplifyconfig)
import { MobileViewProvider } from "../context/MobileViewContext"
import { UserProvider } from "../context/UserContext"
import { CartProvider } from "../context/CartContext"
import { FilterProvider } from "../context/FilterContext"
import ErrorBoundary from "../components/common/ErrorBoundary"

const HelveticaNow = localFont({ src: "../assets/fonts/Helvetica-Now.ttf" })

function TechNexus({ Component, pageProps, categories }) {
  return (
    <>
      <main className={HelveticaNow.className}>
        <React.StrictMode>
          <MobileViewProvider>
            <UserProvider>
              <CartProvider>
                <FilterProvider>
                  <ErrorBoundary>
                    <Layout categories={categories}>
                      <Component {...pageProps} />
                    </Layout>
                  </ErrorBoundary>
                </FilterProvider>
              </CartProvider>
            </UserProvider>
          </MobileViewProvider>
        </React.StrictMode>
      </main>
    </>
  )
}

export default TechNexus
