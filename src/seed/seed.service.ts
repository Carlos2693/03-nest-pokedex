import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { PokeResponse } from './interfaces/pokemon-response.interface';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,

    private readonly http: AxiosAdapter,
  ) {}

  async executeSeed() {

    await this.pokemonModel.deleteMany({}) // delete * from pokemons;

    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=10')

    const pokemonToInsert: { name: string, no: number }[] = []

    data.results.forEach(({name, url}) => {
      const segments = url.split('/')
      const no: number = +segments[segments.length - 2]

      // const pokemon = await this.pokemonModel.create( {name, no} )
      pokemonToInsert.push({name, no}) // [{ name: bulbasur, no: 1 }]
    })

    await this.pokemonModel.insertMany(pokemonToInsert)

    return 'Seed Executed'
  }

  async executeSeed1() {

    await this.pokemonModel.deleteMany({}) // delete * from pokemons;

    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=10')

    const insertPromisesArray = []

    data.results.forEach(({name, url}) => {
      const segments = url.split('/')
      const no: number = +segments[segments.length - 2]

      // const pokemon = await this.pokemonModel.create( {name, no} )
      insertPromisesArray.push(
        this.pokemonModel.create({name, no})
      )
    })

    await Promise.all(insertPromisesArray)

    return 'Seed Executed'
  }
}
