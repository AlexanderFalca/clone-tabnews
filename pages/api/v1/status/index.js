import database from "infra/database";

async function status(request, response) {
  const updateAt = new Date().toISOString();

  const dataBaseVersionResult = await database.query("SHOW server_version");
  const dataBaseVersionValue = dataBaseVersionResult.rows[0].server_version;

  const dataBaseMaxConectionsResult = await database.query(
    "SHOW max_connections",
  );
  const dataBaseMaxConectionsValue =
    dataBaseMaxConectionsResult.rows[0].max_connections;

  const dataBaseName = process.env.POSTGRES_DB;
  const dataBaseOpenConnectionsResult = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [dataBaseName],
  });

  const dataBaseOpenConnectionsValue =
    dataBaseOpenConnectionsResult.rows[0].count;

  response.status(200).json({
    update_at: updateAt,
    dependencies: {
      database: {
        version: dataBaseVersionValue,
        max_connections: parseInt(dataBaseMaxConectionsValue),
        opened_connections: dataBaseOpenConnectionsValue,
      },
    },
  });
}

export default status;
