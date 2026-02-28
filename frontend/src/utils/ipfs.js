import axios from "axios";

const PINATA_API_KEY = process.env.REACT_APP_PINATA_API_KEY;
const PINATA_SECRET = process.env.REACT_APP_PINATA_SECRET;

export const uploadMetadataToIPFS = async (metadata) => {
    const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        metadata,
        {
            headers: {
                pinata_api_key: PINATA_API_KEY,
                pinata_secret_api_key: PINATA_SECRET,
                "Content-Type": "application/json",
            },
        }
    );
    return response.data.IpfsHash; // Returns CID like "QmXyz..."
};
