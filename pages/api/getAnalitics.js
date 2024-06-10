
import axios from "axios"

const clients = [
    { ClientId: '1555739', ApiKey: 'a03eb972-55ea-4701-8c27-7b97ab3e93e8', name: "test" },
    { ClientId: '1624064', ApiKey: 'ae4556a3-2209-483e-b6dc-8a607398e475', name: "unico" },
    { ClientId: '2018338', ApiKey: '678d8495-ff19-4a19-afc3-dc02dfc7ebac', name: "fancy" },
    { ClientId: '1968091', ApiKey: '15259357-b1ba-48e9-8a9f-9a72217e9d05', name: "mipple" }
];

export default async function handler(req, res) {
    try {
        const { from, to, client } = req.body;
        console.log(client, from, to)
        const shop = clients.find(c => c.name == client);
        if (!shop) {
            res.status(404).json({ message: "shop not found" })
            return
        }
        const ozonData = await axios.post('https://api-seller.ozon.ru/v1/analytics/data', {

            "date_from": from,
            "date_to": to,
            metrics: [
                "hits_view_search",
                "hits_view_pdp",
                "hits_view",
                "hits_tocart",
                "session_view",
                "conv_tocart_search",
                "conv_tocart_pdp",
                "conv_tocart"
            ],
            dimension: [
                "sku",
                "day"
            ],
            filters: [],
            sort: [
                {
                    key: "hits_view_search",
                    order: "DESC"
                }
            ],
            limit: 1000,
            offset: 0
        },
            {
                headers: {
                    "Client-Id": shop.ClientId,
                    "Api-Key": shop.ApiKey
                }
            }
        )
        console.log(ozonData.data)
        res.status(200).json(ozonData.data)
    } catch (error) {
    }
}
