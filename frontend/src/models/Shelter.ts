export interface ShelterModel {
    shelter_id: number;
    name: string;
    description: string;
    phone: string;
    email: string;
    city: string;
    street: string;
    postal_code: string;
    building: string;
}

export interface ShelterCardProps extends ShelterModel {
    isLoggedIn?: boolean;
    isFollowed?: boolean;
    onFollow?: (id: number) => void;
}