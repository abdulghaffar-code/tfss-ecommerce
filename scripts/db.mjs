// Start/stop the optional project-local PostgreSQL cluster in .pgdata.
// Override the binary location with PG_BIN if PostgreSQL is installed elsewhere.
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dataDir = path.join(root, ".pgdata");
const port = process.env.PG_PORT || "55432";
const isWindows = process.platform === "win32";

function findBin(name) {
  const candidates = [];
  if (process.env.PG_BIN) candidates.push(path.join(process.env.PG_BIN, name + (isWindows ? ".exe" : "")));
  if (isWindows) {
    candidates.push(path.join("C:/Program Files/PostgreSQL/18/bin", name + ".exe"));
    candidates.push(path.join("C:/Program Files/PostgreSQL/17/bin", name + ".exe"));
  } else {
    candidates.push(`/usr/lib/postgresql/18/bin/${name}`);
    candidates.push(`/usr/lib/postgresql/17/bin/${name}`);
    candidates.push(`/usr/local/pgsql/bin/${name}`);
  }
  const found = candidates.find((candidate) => fs.existsSync(candidate));
  return found || name;
}

const pgCtl = findBin("pg_ctl");
const pgIsReady = findBin("pg_isready");

function ready() {
  const result = spawnSync(pgIsReady, ["-h", "127.0.0.1", "-p", port], {
    stdio: "ignore",
  });
  return result.status === 0;
}

function start() {
  if (!fs.existsSync(path.join(dataDir, "PG_VERSION"))) {
    console.error(
      "No local cluster found. See README.md for the one-time initdb command."
    );
    process.exit(1);
  }
  if (ready()) {
    console.log(`PostgreSQL is already accepting connections on port ${port}.`);
    return;
  }
  const result = spawnSync(
    pgCtl,
    ["-D", dataDir, "-l", path.join(dataDir, "server.log"), "-o", `-p ${port}`, "start"],
    { stdio: "inherit" }
  );
  if (result.status !== 0) process.exit(result.status ?? 1);
  console.log(`PostgreSQL started on port ${port}.`);
}

function stop() {
  if (!ready()) {
    console.log("PostgreSQL is not running.");
    return;
  }
  const result = spawnSync(pgCtl, ["-D", dataDir, "stop", "-m", "fast"], {
    stdio: "inherit",
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
  console.log("PostgreSQL stopped.");
}

function status() {
  console.log(
    ready()
      ? `PostgreSQL is accepting connections on port ${port}.`
      : `PostgreSQL is not accepting connections on port ${port}.`
  );
}

const command = process.argv[2] || "status";
if (command === "start") start();
else if (command === "stop") stop();
else status();
