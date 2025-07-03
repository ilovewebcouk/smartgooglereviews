const fetch = require("node-fetch");

exports.handler = async (event) => {
    const { place_id } = event.queryStringParameters;
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!place_id) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Missing place_id" }),
        };
    }

    try {
        const response = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&fields=name,rating,user_ratings_total,reviews,url&key=${apiKey}`);
        const data = await response.json();

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                name: data.result.name,
                rating: data.result.rating,
                total_reviews: data.result.user_ratings_total,
                url: data.result.url,
                reviews: (data.result.reviews || []).map(r => ({
                    author: r.author_name,
                    rating: r.rating,
                    time: r.relative_time_description,
                    text: r.text
                }))
            }),
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to fetch from Google Places API", detail: err.message }),
        };
    }
};
