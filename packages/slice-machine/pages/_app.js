import { Fragment } from 'react'
import { useRouter } from 'next/router'
import theme from '../src/theme'
import { ThemeProvider, BaseStyles } from 'theme-ui'

import useSwr from 'swr'

import LibProvider from '../src/lib-context'
import ConfigProvider from '../src/config-context'

import LoadingPage from 'components/LoadingPage'
import AuthInstructions from 'components/AuthInstructions'
import ConfigErrors from 'components/ConfigErrors'

import 'rc-drawer/assets/index.css'
import 'lib/builder/layout/Drawer/index.css'
import 'src/css/modal.css'

const AUTH_BLOCKING = true

const fetcher = (url) => fetch(url).then((res) => res.json())

const LibError = () => <div>No libraries. Create one!</div>

function DisplayLibs({
  libraries,
  children
}) {
  return !libraries.length || libraries.err ? <LibError /> : children
}

function MyApp({
  Component,
  pageProps,
}) {
  const router = useRouter()
  const { data: authData } = useSwr('/api/auth', fetcher)
  const { data } = useSwr('/api/libraries', fetcher)

  if (!authData || !data) {
    return <LoadingPage />
  }
  
  console.log({ data })
  if (data.err) return <div>{data.err.reason}. Code: {data.err.status}</div>
  const { libraries = [], config, errors = {} } = data
  
  console.log({ libraries })
  const migrations = libraries.reduce((acc, [_, slices]) => {
    const toMigrate = slices.filter(e => e.migrated)
    return [...acc, ...toMigrate]
  }, [])

  if (migrations.length && router.asPath !== "/migration") {
    router.replace("/migration")
  }



  return (
    <ThemeProvider theme={theme}>
      <BaseStyles>
        <ConfigProvider value={config}>
          <LibProvider value={libraries}>
            {
              !authData.token && AUTH_BLOCKING ? <AuthInstructions /> : (
                <Fragment>
                  {
                    Object.keys(errors).length ? (
                      <ConfigErrors errors ={errors} />
                    ) : <DisplayLibs libraries={libraries}><Component {...pageProps} migrations={migrations} /></DisplayLibs>
                  }
                </Fragment>
              )
            }
          </LibProvider>
        </ConfigProvider>
      </BaseStyles>
    </ThemeProvider>
  );
}

export default MyApp