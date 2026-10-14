/**
 * Google Business Profile Location Discovery & Sync Service
 * Connects to Google's official My Business APIs to discover customer's verified locations.
 */

export interface GoogleDiscoveredLocation {
  googleLocationId: string;
  locationName: string;
  storeCode?: string;
  addressLine1?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  countryCode?: string;
  phoneNumber?: string;
  primaryCategory?: string;
}

/**
 * Calls Google Business Profile APIs to discover all business locations managed by the authorized account.
 * Handles API limits and empty locations gracefully without throwing errors.
 */
export async function fetchGoogleBusinessLocations(
  accessToken: string
): Promise<GoogleDiscoveredLocation[]> {
  const discovered: GoogleDiscoveredLocation[] = [];

  try {
    // 1. Fetch user's managed Google Business accounts
    const accountsRes = await fetch("https://mybusinessaccountmanagement.googleapis.com/v1/accounts", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!accountsRes.ok) {
      // If accounts cannot be retrieved (e.g. fresh account without GMB), return empty list gracefully
      return discovered;
    }

    const accountsData = await accountsRes.json();
    const accounts = accountsData.accounts || [];

    // 2. For each account, fetch its verified locations
    for (const acc of accounts) {
      if (!acc.name) continue;

      const locRes = await fetch(
        `https://mybusinessbusinessinformation.googleapis.com/v1/${acc.name}/locations?readMask=name,title,storeCode,storefrontAddress,phoneNumbers,categories`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (locRes.ok) {
        const locData = await locRes.json();
        const locations = locData.locations || [];

        for (const loc of locations) {
          discovered.push({
            googleLocationId: loc.name,
            locationName: loc.title || "Business Location",
            storeCode: loc.storeCode,
            addressLine1: loc.storefrontAddress?.addressLines?.[0] || "",
            city: loc.storefrontAddress?.locality || "",
            state: loc.storefrontAddress?.administrativeArea || "",
            postalCode: loc.storefrontAddress?.postalCode || "",
            countryCode: loc.storefrontAddress?.regionCode || "",
            phoneNumber: loc.phoneNumbers?.primaryPhone || "",
            primaryCategory: loc.categories?.primaryCategory?.displayName || "",
          });
        }
      }
    }
  } catch (err) {
    console.warn("Google Business location discovery notice:", err);
  }

  return discovered;
}
