function readValue(args, key) {
  const prefix = `${key}=`;
  const matched = args.find((item) => item.startsWith(prefix));
  return matched ? matched.slice(prefix.length).trim() : "";
}

export function parsePushTestArgs(args) {
  const title = readValue(args, "--title") || "RamadanKu test notification";
  const body = readValue(args, "--body") || "Ini ialah notifikasi ujian dari RamadanKu.";

  const endpoint = readValue(args, "--endpoint");
  if (endpoint) {
    return {
      target: { type: "endpoint", endpoint },
      title,
      body,
    };
  }

  const zone = readValue(args, "--zone").toUpperCase();
  if (zone) {
    return {
      target: { type: "zone", zone },
      title,
      body,
    };
  }

  if (args.includes("--all")) {
    return {
      target: { type: "all" },
      title,
      body,
    };
  }

  throw new Error("Provide one target: --all OR --zone=ZONE OR --endpoint=ENDPOINT");
}
