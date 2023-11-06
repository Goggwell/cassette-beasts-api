# Cassette Beasts API

> **Warning**
> This API and the data behind it are a work-in-progress.
>
> Feel free to set it up yourself and test it out, but note that is it NOT production ready.

## About

I decided to build an API for one of my favorite games, [Cassette Beasts](https://store.steampowered.com/app/1321440/Cassette_Beasts/).

- [Neon](https://neon.tech) for our Postgres database
- [Prisma](https://prisma.io) as a schema management tool
- [Kysely](https://kysely.dev) for building type-safe queries
- [tRPC](https://trpc.io) and [Fastify](https://fastify.dev) for our API

For now I've been manually inputting data into our database by using [Neon's SQL Editor](https://neon.tech/docs/get-started-with-neon/query-with-neon-sql-editor) and running some queries similar to this:

```sql
INSERT INTO beasts
    (beastid, name, type, remaster_from, remaster_to, base_stats, description, images)
VALUES
    (
        '001',
        'springheel',
        'beast',
        '{"monsters":[{}]}',
        '{"monsters":[{"id":"002","name":"hopskin","image":"https://wiki.cassettebeasts.com/images/a/ab/Hopskin.png"},{"id":"004","name":"snoopin","image":"https://wiki.cassettebeasts.com/images/7/71/Snoopin.png"}]}',
        '{"max_hp":"90","m_atk":"130","m_def":"80","r_atk":"80","r_def":"90","speed":"150"}',
        'Springheels get their kicks by hiding behind corners under the cover of night, before leaping out to surprise their victims. It appears that they make their “wings” out of old discarded rags.',
        '{"standard":"https://wiki.cassettebeasts.com/images/3/3c/Springheel.png","animated":"https://wiki.cassettebeasts.com/images/a/ac/Springheel_idle.gif"}'
    )
```

The table itself needs some refining, and obviously there's a better way of doing this but I've kept it simple for now so that I can actually finish this project.

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
