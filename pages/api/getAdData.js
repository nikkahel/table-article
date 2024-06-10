import axios from 'axios';

const clients = [
    { ClientId: '28032394-1714945890880@advertising.performance.ozon.ru', ApiKey: 'Flbur1UMgsAV3akq8lZ4ZWhzNSqwR5wXxSbB-ycrMgFZzKOVFQFey2jCKYM1gMHM7MvrbqHoInk9VsNazw', name: "test" },
    { ClientId: '27497991-1714065880590@advertising.performance.ozon.ru', ApiKey: 'AYTBk2gCzAssWDKUcd98x09BmDomWjTfP0zwR901-Sf-ztYPjgK41Ij-E2VHJ_N8PKScKZa5Fx8thNMfwQ', name: "test2" },
    { ClientId: '27498003-1714065949904@advertising.performance.ozon.ru', ApiKey: 'bTgrUDM9EQNgqCgIk-BFGfL3RF-s1aq06H4fnOJcLF9A632fA7yPAd_zI8_daI56pZModYIEv6FuhNCScQ', name: "unico" },
    { ClientId: '28843763-1716292694205@advertising.performance.ozon.ru', ApiKey: 'tzi_QpaVAAZg_nrKmjY1RdlYNMVxuHK-xpGwNkjYtkg_AnAgAodUHSNsq4lojkAOJiR1CSpDhWVi_zzyjQ', name: "fancy" },
    { ClientId: '29153161-1716899725166@advertising.performance.ozon.ru', ApiKey: '5LIWKK-YbCJZf_E5bQ61p2e0qlBw_qz3oklAtcpsn8_ifD9qqJtnVkwRJV-h_PSRc6qMu5SEvmhNcKGOPg', name: "mipple" }
];

const fetchToken = async (clientId, clientSecret) => {
    try {
        const response = await axios.post("https://performance.ozon.ru/api/client/token", {
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: "client_credentials"
        });
        return response.data.access_token;
    } catch (error) {
        console.error('Error fetching token:', error);
        throw error;
    }
};

const fetchData = async (token, dateFrom, dateTo, campaigns = []) => {
    try {
        const response = await axios.get('https://performance.ozon.ru:443/api/client/statistics/campaign/product/json', {
            params: {
                campaigns,
                dateFrom,
                dateTo
            },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

export default async function handler(req, res) {
    try {
        const { from, to, client } = req.body;

        // Validate date format
        if (!from || !to || !client) {
            res.status(400).json({ message: "Invalid input parameters" });
            return;
        }

        // Determine clients to process
        const shops = (client === 'test') 
            ? clients.filter(c => c.name === 'test' || c.name === 'test2')
            : clients.filter(c => c.name === client);

        if (shops.length === 0) {
            res.status(404).json({ message: "Shop not found" });
            return;
        }

        // Fetch data for each client
        const results = await Promise.all(shops.map(async (shop) => {
            try {
                const token = await fetchToken(shop.ClientId, shop.ApiKey);
                const data = await fetchData(token, from, to);
                return { name: shop.name, data };
            } catch (error) {
                console.error(`Error fetching data for ${shop.name}:`, error);
                return { name: shop.name, error: error.message };
            }
        }));

        res.status(200).json(results);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
