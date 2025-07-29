/**
 * Helper for managing multiple React Contexts
 */

export const MultiContextProvider = ({ children, providersList = [] }) => {
  return providersList.reduce((acc, Provider) => {
    return <Provider>{acc}</Provider>
  }, children)
}
