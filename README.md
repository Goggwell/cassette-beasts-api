# Cassette Beasts API

> **Warning**
> I have discontinued this API in favor of my [other one](https://github.com/Goggwell/hono-cassette-api)
>
> Feel free to peruse the contents of this repo, but it will no longer be maintained so please post your queries in the other one!

## About

I decided to build an API for one of my favorite games, [Cassette Beasts](https://store.steampowered.com/app/1321440/Cassette_Beasts/).

- [Neon](https://neon.tech) for our Postgres database
- [Prisma](https://prisma.io) as a schema management tool
- [Kysely](https://kysely.dev) for building type-safe queries
- [tRPC](https://trpc.io) and [Fastify](https://fastify.dev) for our API

All the information and assets come from the official [Cassette Beasts Wiki](https://wiki.cassettebeasts.com) so please check it out yourself!

## API Reference

#### Get all monsters

```http
  GET /api/getMonsters
```

#### Get paginated list of monsters

```http
  GET /api/getMonstersOffset?input={"limit":${limit},"offset":${offset}}
```

| Parameter | Type     | Description                                                                                            |
| :-------- | :------- | :----------------------------------------------------------------------------------------------------- |
| `limit`   | `number` | **Required**. Amount of monsters returned                                                              |
| `offset`  | `number` | **Required**. Starting location of data (move to 'next page' by making 'offset' a multiple of 'limit') |

#### Get monster by ID

```http
  GET /api/getMonsterById?input=${id}
```

| Parameter | Type     | Description                 |
| :-------- | :------- | :-------------------------- |
| `id`      | `number` | **Required**. ID of monster |

#### Get monster by name

```http
  GET /api/getMonsterByName?input="${name}"
```

| Parameter | Type     | Description                   |
| :-------- | :------- | :---------------------------- |
| `name`    | `string` | **Required**. Name of monster |

#### Filter monsters by type

```http
  GET /api/filterMonstersByType?input="${type}"
```

| Parameter | Type     | Description                         |
| :-------- | :------- | :---------------------------------- |
| `type`    | `string` | **Required**. Specific monster type |

## Why the 'kysely-neon' folder exists

The actual module for [kysely-neon](https://github.com/seveibar/kysely-neon) has an unmet peer dependency error that caused my deployment to fail when running my build script.
So I just ported the module over here so that I can use it without having to downgrade [@neondatabase/serverless](https://github.com/neondatabase/serverless) (especially since downgrading this package creates a lot of errors in our code)
