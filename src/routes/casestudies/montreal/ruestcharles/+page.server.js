import {v2 as cloudinary} from 'cloudinary'

import { CLOUDINARY_API_SECRET, CLOUDINARY_API_KEY } from '$env/static/private';

cloudinary.config({ 
    cloud_name: 'dfseerxb3', 
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true
  });

  export const load = async () => {
    const fetchPhotos = async () => {
        const jsonList = cloudinary.url("ruestcharles.json", {type: "list"})
        const photoData = await fetch(jsonList).then((d) => d.json());      
        return photoData
    }

    return {
        photos: await fetchPhotos(),
    }
}