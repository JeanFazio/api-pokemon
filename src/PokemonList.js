import React, { useState } from 'react';
import './App.css'; // Importando o CSS

const PokemonList = () => {
    const [pokemonId, setPokemonId] = useState('');
    const [pokemonData, setPokemonData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchPokemon = async (id) => {
        setLoading(true);
        setError(null);
        setPokemonData(null);
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
            if (!response.ok) {
                throw new Error('Pokémon não encontrado!');
            }
            const data = await response.json();
            setPokemonData(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const getPokemonColor = (types) => {
        const type = types[0].type.name;
        const typeColors = {
            fire: '#F57D31',
            water: '#6493EB',
            grass: '#74CB48',
            electric: '#F9CF30',
            ice: '#9AD6DF',
            fighting: '#C12239',
            poison: '#A43E9E',
            ground: '#DEC16B',
            flying: '#A891EC',
            psychic: '#FB5584',
            bug: '#A7B723',
            rock: '#B69E31',
            ghost: '#70559B',
            dragon: '#7037FF',
            dark: '#75574C',
            steel: '#B7B9D0',
            fairy: '#E69EAC',
            default: '#A8A77A',
        };
        return typeColors[type] || typeColors['default'];
    };

    const proximoPokemon = () => {
        const novoId = (Number(pokemonId) + 1).toString();
        setPokemonId(novoId);
        fetchPokemon(novoId); // Busca o próximo Pokémon
    };

    const voltarPokemon = () => {
        const novoId = (Number(pokemonId) - 1).toString();
        setPokemonId(novoId);
        fetchPokemon(novoId); // Busca o Pokémon anterior
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchPokemon(pokemonId); // Busca o Pokémon atual quando o formulário é enviado
    };

    return (
        <div className="pokedex-container">
            <h1 className="pokedex-title">Pokédex</h1>

            {/* Formulário para simplificar o envio ao clicar em Enter */}
            <form onSubmit={handleSubmit} className="search-container">
                <input
                    className="pokemon-input"
                    type="text"
                    placeholder="Digite o ID ou o nome do Pokémon"
                    value={pokemonId}
                    onChange={(e) => setPokemonId(e.target.value)}
                />
                <button className="search-button" type="submit">Buscar</button>
            </form>

            {loading && <div className="loading-spinner"></div>}

            {error && <p className="error-message">{error}</p>}

            {pokemonData && (
                <div className="pokemon-card" style={{ backgroundColor: getPokemonColor(pokemonData.types) }}>
                    <div className="pokemon-header">
                        <img src={pokemonData.sprites.front_default} alt={pokemonData.name} className="pokemon-image" />
                        <div className="pokemon-hp">
                            HP {pokemonData.stats[0].base_stat}
                        </div>
                    </div>
                    <h2 className="pokemon-name">{pokemonData.name}</h2>
                    <p className="pokemon-type">{pokemonData.types[0].type.name}</p>
                    <div className="pokemon-stats">
                        <div className="pokemon-stat">Altura: <span className="pokemon-stat-value">{pokemonData.height}</span></div>
                        <div className="pokemon-stat">Peso: <span className="pokemon-stat-value">{pokemonData.weight}</span></div>
                    </div>

                    <p className="pokemon-info">Habilidades:</p>
                    <ul className="pokemon-abilities">
                        {pokemonData.abilities.map((ability, index) => (
                            <li key={index}>{ability.ability.name}</li>
                        ))}
                    </ul>
                    <div className='pokemon-button'>
                        {Number(pokemonId) > 1 && <button onClick={voltarPokemon}>Voltar</button>}
                        {Number(pokemonId) < 1025 && <button onClick={proximoPokemon}>Próximo</button>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PokemonList;
