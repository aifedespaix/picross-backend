# Migration `watch-20191015081126`

This migration has been generated at 10/15/2019, 8:11:26 AM.
You can check out the [state of the datamodel](./datamodel.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE "lift"."Picross" (
  "createdAt" DATE NOT NULL DEFAULT '1970-01-01 00:00:00'  ,
  "id" TEXT NOT NULL   ,
  "map" TEXT NOT NULL DEFAULT ''  ,
  "updatedAt" DATE NOT NULL DEFAULT '1970-01-01 00:00:00'  ,
  PRIMARY KEY ("id")
);
```

## Changes

```diff
diff --git datamodel.mdl datamodel.mdl
migration watch-20191015072520..watch-20191015081126
--- datamodel.dml
+++ datamodel.dml
@@ -22,5 +22,12 @@
   email    String  @unique
   password String
   name     String?
   posts    Post[]
-}
+}
+
+model Picross {
+  id        String  @default(cuid()) @id
+  map       String
+  createdAt DateTime @default(now())
+  updatedAt DateTime @updatedAt
+}
```

## Photon Usage

You can use a specific Photon built for this migration (watch-20191015081126)
in your `before` or `after` migration script like this:

```ts
import Photon from '@generated/photon/watch-20191015081126'

const photon = new Photon()

async function main() {
  const result = await photon.users()
  console.dir(result, { depth: null })
}

main()

```
