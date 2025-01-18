import mongoose, { Document, Schema } from "mongoose";


export interface MediaModel extends Document {
    show_id: string;
    type: string
    title: string;
    director: string;
    country: string;
    date_added: string;
    release_year: number;
    duration: string;
    listed_in: string;
    description: string;
}

const MediaSchema = new Schema<MediaModel>({
    show_id: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    director: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    date_added: {
        type: String,
        required: true,
    },
    release_year: {
        type: Number,
        required: true,
    },
    duration: {
        type: String,
        required: true,
    },
    listed_in: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
})

export const MediaModel = mongoose.model('netflixshows', MediaSchema)