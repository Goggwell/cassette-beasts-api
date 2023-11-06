## Why this folder exists

The actual module for [kysely-neon](https://github.com/seveibar/kysely-neon) has an unmet peer dependency error that caused my deployment to fail when running my build script.
So I just ported the module over here so that I can use it without having to downgrade [@neondatabase/serverless](https://github.com/neondatabase/serverless) (especially since downgrading this package creates a lot of errors in our code)
