import { useState, useMemo } from "react";
import { POKEMON_DATA, TYPE_COLORS, Pokemon } from "@/lib/pokemonData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Search } from "lucide-react";

/**
 * Modern Minimalist Pokédex
 * - Clean, distraction-free interface
 * - Electric blue accents (#0066FF)
 * - Poppins headings + Inter body text
 * - Smooth transitions and hover effects
 * - Pokémon images from official PokéAPI artwork
 */

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);

  // Get unique types from all Pokémon
  const allTypes = useMemo(() => {
    const types = new Set<string>();
    POKEMON_DATA.forEach((p) => p.type.forEach((t) => types.add(t)));
    return Array.from(types).sort();
  }, []);

  // Filter Pokémon based on search and type
  const filteredPokemon = useMemo(() => {
    return POKEMON_DATA.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toString().includes(searchTerm);
      const matchesType = !selectedType || p.type.includes(selectedType);
      return matchesSearch && matchesType;
    });
  }, [searchTerm, selectedType]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedType(null);
  };

  const getPokemonImageUrl = (id: number) => {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/pokemon/other/official-artwork/${id}.png`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur">
        <div className="container py-6">
          <h1 className="text-3xl font-bold text-foreground">Kanto Pokédex</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Complete reference for all 151 Pokémon from the Kanto region
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        {/* Search and Filters */}
        <div className="space-y-6 mb-8">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder="Search by name or ID (e.g., 'Pikachu' or '25')"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-2 h-11 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          {/* Type Filters */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">Filter by Type</p>
            <div className="flex flex-wrap gap-2">
              {allTypes.map((type) => (
                <button
                  key={type}
                  onClick={() =>
                    setSelectedType(selectedType === type ? null : type)
                  }
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedType === type
                      ? "bg-accent text-white shadow-md"
                      : "bg-secondary text-foreground hover:bg-border"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Clear Filters Button */}
          {(searchTerm || selectedType) && (
            <button
              onClick={handleClearFilters}
              className="text-sm text-accent hover:underline flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Clear filters
            </button>
          )}

          {/* Results Count */}
          <p className="text-sm text-muted-foreground">
            Showing {filteredPokemon.length} of {POKEMON_DATA.length} Pokémon
          </p>
        </div>

        {/* Pokémon Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredPokemon.map((pokemon) => (
            <button
              key={pokemon.id}
              onClick={() => setSelectedPokemon(pokemon)}
              className="group bg-white border border-border rounded-lg p-4 hover:shadow-lg hover:border-accent transition-all duration-200 text-left"
            >
              {/* Pokémon Image */}
              <div className="w-full aspect-square bg-secondary rounded-md mb-3 flex items-center justify-center group-hover:bg-accent/10 transition-colors overflow-hidden">
                <img
                  src={getPokemonImageUrl(pokemon.id)}
                  alt={pokemon.name}
                  className="w-full h-full object-contain p-2"
                  loading="lazy"
                />
              </div>

              {/* Pokémon Name */}
              <h3 className="font-semibold text-foreground truncate">
                {pokemon.name}
              </h3>

              {/* Types */}
              <div className="flex gap-1 mt-2 flex-wrap">
                {pokemon.type.map((type) => (
                  <span
                    key={type}
                    className="text-xs font-medium text-white px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: TYPE_COLORS[type] || "#999" }}
                  >
                    {type}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>

        {filteredPokemon.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No Pokémon found matching your search.
            </p>
            <button
              onClick={handleClearFilters}
              className="text-accent hover:underline mt-2"
            >
              Clear filters and try again
            </button>
          </div>
        )}
      </main>

      {/* Detail Modal */}
      {selectedPokemon && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPokemon(null)}
        >
          <div
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-border p-6 flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {selectedPokemon.name}
                </h2>
                <p className="text-sm text-muted-foreground">
                  #{selectedPokemon.id.toString().padStart(3, "0")}
                </p>
              </div>
              <button
                onClick={() => setSelectedPokemon(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Pokémon Image */}
              <div className="w-full aspect-square bg-secondary rounded-lg flex items-center justify-center overflow-hidden">
                <img
                  src={getPokemonImageUrl(selectedPokemon.id)}
                  alt={selectedPokemon.name}
                  className="w-full h-full object-contain p-4"
                />
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  Description
                </h3>
                <p className="text-sm text-foreground leading-relaxed">
                  {selectedPokemon.description}
                </p>
              </div>

              {/* Types and Abilities */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Types</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedPokemon.type.map((type) => (
                      <span
                        key={type}
                        className="text-xs font-medium text-white px-3 py-1 rounded-full"
                        style={{ backgroundColor: TYPE_COLORS[type] || "#999" }}
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Abilities
                  </h3>
                  <div className="space-y-1">
                    {selectedPokemon.abilities.map((ability) => (
                      <p
                        key={ability}
                        className="text-sm text-foreground bg-secondary px-2 py-1 rounded"
                      >
                        {ability}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Physical Characteristics */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Height</p>
                  <p className="text-lg font-semibold text-foreground">
                    {selectedPokemon.height}m
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Weight</p>
                  <p className="text-lg font-semibold text-foreground">
                    {selectedPokemon.weight}kg
                  </p>
                </div>
              </div>

              {/* Base Stats */}
              <div>
                <h3 className="font-semibold text-foreground mb-3">Base Stats</h3>
                <div className="space-y-2">
                  {[
                    { label: "HP", value: selectedPokemon.hp },
                    { label: "Attack", value: selectedPokemon.attack },
                    { label: "Defense", value: selectedPokemon.defense },
                    { label: "Sp. Atk", value: selectedPokemon.spAtk },
                    { label: "Sp. Def", value: selectedPokemon.spDef },
                    { label: "Speed", value: selectedPokemon.speed },
                  ].map((stat) => (
                    <div key={stat.label} className="flex items-center gap-3">
                      <span className="text-sm font-medium text-foreground w-16">
                        {stat.label}
                      </span>
                      <div className="flex-1 bg-secondary rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-accent h-full transition-all duration-300"
                          style={{
                            width: `${Math.min((stat.value / 255) * 100, 100)}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-foreground w-10 text-right">
                        {stat.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Evolution Chain */}
              {selectedPokemon.evolutions.length > 0 && (
                <div>
                  <h3 className="font-semibold text-foreground mb-3">
                    Evolution Chain
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedPokemon.evolutions.map((evoId) => {
                      const evoPokemon = POKEMON_DATA.find(
                        (p) => p.id === evoId
                      );
                      return (
                        <button
                          key={evoId}
                          onClick={() => {
                            if (evoPokemon) setSelectedPokemon(evoPokemon);
                          }}
                          className="px-3 py-1.5 bg-secondary hover:bg-accent hover:text-white text-foreground rounded-lg text-sm font-medium transition-all duration-200"
                        >
                          {evoPokemon?.name || `#${evoId}`}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
