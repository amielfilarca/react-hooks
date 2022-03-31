// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {ErrorBoundary} from 'react-error-boundary'
import {
  fetchPokemon,
  PokemonDataView,
  PokemonForm,
  PokemonInfoFallback,
} from '../pokemon'

function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState({
    pokemon: null,
    status: 'idle',
    error: null,
  })

  React.useEffect(() => {
    if (!pokemonName) return
    setState({status: 'pending'})
    fetchPokemon(pokemonName)
      .then(pokemonData => {
        setState({pokemon: pokemonData, status: 'resolved'})
      })
      .catch(error => {
        setState({status: 'rejected', error})
      })
  }, [pokemonName])

  if (state.status === 'idle') return <div>Submit a pokemon</div>

  if (state.status === 'pending')
    return <PokemonInfoFallback name={pokemonName} />

  if (state.status === 'resolved')
    return <PokemonDataView pokemon={state.pokemon} />

  if (state.status === 'rejected') throw state.error
}

const ErrorFallback = ({error, resetErrorBoundary}) => (
  <div role="alert">
    There was an error:{' '}
    <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
    <button onClick={resetErrorBoundary}>Try again</button>
  </div>
)

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onReset={() => setPokemonName('')}
          resetKeys={[pokemonName]}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
