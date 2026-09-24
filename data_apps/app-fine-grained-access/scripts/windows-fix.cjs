// Workaround for @metabase/embedding-sdk-react 0.64.0-alpha/beta: its CLI bundle
// calls fileURLToPath() at load time on a Linux file URL baked in at build time
// (file:///home/runner/...), which throws ERR_INVALID_FILE_URL_PATH on Windows.
// Make that call tolerant. Harmless on Linux/macOS. Remove once the SDK is fixed.
const url = require("node:url");
const orig = url.fileURLToPath;
url.fileURLToPath = (u, o) => { try { return orig(u, o); } catch { return String(u); } };
