import React from "react"
import Layout from "../layouts/Layout"
import localFont from "next/font/local"
import "../assets/globals.css"
import { Amplify } from "aws-amplify"
import amplifyconfig from "../src/amplifyconfiguration.json"
Amplify.configure(amplifyconfig)
import { MobileViewProvider } from "../context/MobileViewContext"
import { UserProvider } from "../context/UserContext"
import { CartProvider } from "../context/CartContext"
import { FilterProvider } from "../context/FilterContext"
import ErrorBoundary from "../components/common/ErrorBoundary"

const SFPro = localFont({ src: "../assets/fonts/SF-Pro.ttf" })

function TechNexus({ Component, pageProps, categories }) {
  return (
    <>
      <main className={SFPro.className}>
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
