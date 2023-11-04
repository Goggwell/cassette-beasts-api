# Acme Corp

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
