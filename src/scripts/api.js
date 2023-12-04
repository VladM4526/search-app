import axios from "axios";

const BASE_URl_PHOTOS = "https://pixabay.com/api/";

const { API_KEY } = process.env;
const QUERY_OPT_PHOTOS =
  "image_photo&orientation=horizontal&order&category&safesearch=true";

async function searchPhotos(value, pages, per_pages) {
  const response = await axios.get(
    `${BASE_URl_PHOTOS}?key=${API_KEY}&q=${value}&${QUERY_OPT_PHOTOS}&page=${pages}&per_page=${per_pages}`
  );
  return response;
}

export { searchPhotos };
