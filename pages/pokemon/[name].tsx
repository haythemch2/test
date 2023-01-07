import React from "react";
import Layout from "../../components/Layout";
import Image from "next/image";

type pokemon = {
  name: string;
  height: 20;
  base_experience: number;
  id: number;
  is_default: boolean;
  location_area_encounters: string;
  order: number;
  weight: number;
  types: pokeType[];
  stats: pokeStat[];
};
type pokeType = {
  slot: number;
  type: {
    name: string;
    url: string;
  };
};
type pokeStat = {
  base_stat: number;
  effort: 0;
  stat: stat;
};
type stat = {
  name: string;
  url: string;
};
type props = {
  pokemon: pokemon;
  found: boolean;
};
const Pokemon = ({ pokemon, found }: props) => {
  if (!found) {
    return (
      <Layout title={"NOT FOUND"}>
        <div className="flex flex-col justify-center items-center"></div>
      </Layout>
    );
  }

  const pokeIndex = ("000" + pokemon?.id).slice(-3);
  const pokeName = pokemon?.name[0].toUpperCase() + pokemon?.name.slice(1);

  const renderTypes = () =>
    pokemon?.types.map((type) => (
      <li key={type.slot} className="px-2 py-1 bg-slate-700 rounded">
        {type.type.name}
      </li>
    ));

  const renderStats = () =>
    pokemon?.stats.map((stat, index) => (
      <div key={index} className="bg-slate-700 my-2 rounded p-1">
        <div
          className="bg-slate-900 rounded px-2"
          style={{ width: `${stat.base_stat}%` }}
        >
          {stat.stat.name}: {stat.base_stat}
        </div>
      </div>
    ));

  return (
    <Layout title={pokeName}>
      <div className="flex flex-col justify-center items-center">
        <span className="absolute top-[20px]  font-bold text-slate-500">
          #{pokeIndex}
        </span>
        <Image
          alt={pokemon.name}
          width={400}
          height={400}
          src={`https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${pokeIndex}.png`}
        />
      </div>

      <div className="bg-slate-900 rounded p-5">
        <ul className="flex gap-5">{renderTypes()}</ul>

        <div>{renderStats()}</div>
      </div>
    </Layout>
  );
};

export default Pokemon;

export async function getServerSideProps(context) {
  let found;
  let pokemon = null;
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${context.query.name}`
    );

    pokemon = await response.json();

    found = true;
  } catch (e) {
    found = false;
  }

  return {
    props: {
      pokemon,
      found,
    },
  };
}
