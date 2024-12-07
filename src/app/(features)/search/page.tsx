import { headers } from "next/headers";
import IphoneSearch from "~/_components/iphone-search";
import { getIphonesInfos } from "~/server/queries";

export default async function page() {
  const headersList = headers();
  const search = new URLSearchParams(headersList.get("x-query")!);
  const searchResults = await getIphonesInfos(search.get("imei")!);

  return <IphoneSearch barcode={search.get("imei")!} searchResults={searchResults} />
}
