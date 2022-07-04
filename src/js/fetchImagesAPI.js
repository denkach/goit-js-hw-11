import axios from "axios";

const API_KEY = '28410112-890d31eb018b119befebb0576';


const searchParams = new URLSearchParams({
    key : API_KEY,
    image_type: "photo",
    orientation: "horizontal",
    safesearch: "true",
    per_page: 40,
});



export default async function fetchImages(name, page) {
    const url = `https://pixabay.com/api/?q=${name}&${searchParams}&page=${page}`;
  

    return await axios.get(url).then(res => res.data);
}