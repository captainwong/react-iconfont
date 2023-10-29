import { getConfig } from "./config";
import { fetchMock, fetchXml } from "./fetch-xml";
import { gen } from "./gen";

const config = getConfig();
fetchXml(config.url).then((data) => {
  gen(data, config);
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
