import React from "react"
import browserLang from "browser-lang"
import { withPrefix } from "gatsby"
import { IntlProvider } from "react-intl"
import { IntlContextProvider } from "./intl-context"

const preferDefault = (m) => (m && m.default) || m

const withIntlProvider = (intl) => (children) => {
  return (
    <IntlProvider
      locale={intl.language}
      defaultLocale={intl.defaultLanguage}
      messages={intl.messages}
    >
      <IntlContextProvider value={intl}>{children}</IntlContextProvider>
    </IntlProvider>
  )
}

export default ({ element, props }, pluginOptions) => {
  if (!props) {
    return
  }

  const { pageContext, location } = props
  const { defaultLanguage } = pluginOptions
  const { intl } = pageContext
  const { language, languages, redirect, routed, originalPath } = intl

  if (typeof window !== "undefined") {
    window.___gatsbyIntl = intl
  }
  /* eslint-disable no-undef */
  const isRedirect = redirect && !routed

  if (isRedirect) {
    const { search } = location

    // Skip build, Browsers only
    if (typeof window !== "undefined") {
      let detected =
        window.localStorage.getItem("gatsby-intl-language") ||
        browserLang({
          languages,
          fallback: language,
        })

      if (!languages.includes(detected)) {
        detected = language
      }

      const queryParams = search || ""
      const newUrl = withPrefix(`/${detected}${originalPath}${queryParams}`)
      window.localStorage.setItem("gatsby-intl-language", detected)
      window.location.replace(newUrl)
    }
  }
  const renderElement = isRedirect
    ? GATSBY_INTL_REDIRECT_COMPONENT_PATH &&
      React.createElement(
        preferDefault(require(GATSBY_INTL_REDIRECT_COMPONENT_PATH))
      )
    : element
  return withIntlProvider(intl)(renderElement)
}
